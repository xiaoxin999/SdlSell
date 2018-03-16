import orderHttp from "./order_http";
import utils from "src/verdor/utils";
import storage from "src/verdor/storage";
import eventUtil from "src/verdor/event-utils";
import {store} from "src/manager/store";
import orderStore from "./details_store";
import global from "src/manager/global";

const shopId = storage.session("shopId")||utils.getQueryString("shopId")||61;
let isloading = false;

// 本地数据结构S
let orderData = {
	shopId: 61, // 闪店id
	uid: 1, // 登录者id
	user: null, // 登录者信息
	shopList: null, // 多店模式，店铺列表信息
	goods: null, // 所有商品的信息
	inventory: [],
	goodsIndexObj: {}, // 所有商品数据索引字典,为了快速查询 (key=good.id , value = 索引)
	packageIndexObj: {}, // 所有套餐数据索引字典,为了快速查询 (key=package.id , value = 索引)
	packageTagIndexObj: {}, // 所有套餐标识索引字典，为了快速查询 (key=packageTag.id , value = [packageGoods])
	others: null, // 其他信息
	goodsConfigVer: '0', //商品配置版本号
	otherConfigVer: '0', //其他配置版本号
	inventoryVer: '0', //商品库存版本号
	reservationVer: '0', //预约中的数量
	tableVer: '0', //桌台版本号
	orderList: null, // 订单信息, 每3秒自动刷新，已经提交到服务器的
	image: true, // 是否显示图片
	imageCdnUrl: '', // 
	tablesOrder: {}, // 临时订单信息
	currentTableId: 0, // 获取当前选中的桌台id
	currentShop: null,
	version: 1,
	imgConfig: [], // 图片是否下载到本地
	counterTableId: 0, // 反结账的桌台id
	counter: false, // 是否是反结账   true为反结账
	//		微信单点
	orderInfo: {}, //包含的订单信息
	oAllGoodsList: [], //所有的商品列表
	oGood: null, // 选中的id
	oPackageList: [], //购物车套餐列表
	oGoodsList: [], //购物车商品列表
	oTotalPrice: 0, //购物车商品总价
	oTotalNum: 0, //购物车的总数量
	changeNav: false,
	oNavInfo: {}, //记录当前的选中导航
	sh: "",
	nl: "",
	n2l: "",
	timeArea: {}, //营业时间
	//选择店铺
	merchId: null,
	comparisonArr: [], //商品比较数组
	isPackageType: {}, // 套餐类型是否存在
	groupGoodsObj: {}, //多规格的商品索引 id : [{},{}];
	complete_init: false, //是否完成了数据的初始化
	goodsList: {}, //以id的形式存储商品数据
	packageGoods: {}, //以id的形式存储套餐中商品的数据
	packageTag: {}, // 以id的形式存储套餐中标识的数据
	showGoodsIndex : {} // 展示的商品数据下标
};


/**
 * 初始化数据服务
 */
orderData.init = async function () {

	if(isloading) return;

	var selectShopInfo = storage.session("select-shop");
	store.commit("setParseOk",false);
	if (selectShopInfo) {
		orderData.goodsUrlMiddle = selectShopInfo.goodsUrlMiddle;
		orderData.token = selectShopInfo.accessToken;
		this.checkVersion();

	} else {
		
		this.checkVersion();
		let data = await orderHttp.getOpenId();
		orderData.goodsUrlMiddle = data.uploadPic.picMiddle;
		orderData.token = data.accessToken;
		orderData.shopName = data.shopName;
		// orderData.fid = data.mid;

	}

	orderData.others = {};
	orderData.packageTag = {};
	orderData.packageGoods = {};
	orderData.packageIndexObj = {};
	orderData.goodsList = {};
	orderData.showGoodsIndex = {};

	orderData.tableId = utils.getQueryString('tableId');
};


//检查版本信息
orderData.checkVersion = async function(){
	
	

	let data = await orderHttp.getVerCode();
	let shopId = global.getShopId();
	let version = storage.localData('vercode_'+shopId);

	//需要加载的数组对象
	var needLoad = [];
	//需要处理的数据对象
	var parserObj = {}
	
	if(version){

		//查看商品缓存
		if(version.goodsConfigVer !== data.goodsConfigVer){
			needLoad.push('getGoodsList');
		}
		else{
			this.goods = storage.localData('goodsList_'+shopId);
			if(this.goods) parserObj.parserGood = this.goods;
			else needLoad.push('getGoodsList');
		}
		//查看库存缓存
		if(version.inventoryVer !== data.inventoryVer){
			needLoad.push('getInventoryList');
		}
		else{
			this.inventory = storage.localData('inventoryList_'+shopId);
			if(this.inventory) parserObj.parserInventory = this.inventory;
			else  needLoad.push('getInventoryList');
		}
		//查看other库存
		if(version.otherConfigVer !== data.otherConfigVer){
			needLoad.push('getOtherList');
		}
		else{
			this.other = storage.localData('otherList_'+shopId);
			if(this.other) parserObj.parserOther = this.other;
			else  needLoad.push('getOtherList'); 
		}
	
	}
	else{
		needLoad.push('getGoodsList','getInventoryList','getOtherList');
	}

	//存储版本号
	storage.localData('vercode_'+shopId,data,false);


	//同步并行加载数据
	let loadPro =  [];
	for(let item of needLoad){
		loadPro.push(orderHttp[item]());
	}
	//把加载的状态改为true
	isloading = true;
	let loadData =  await Promise.all(loadPro);
	for(let item of loadData){
		let {type,data} = item;
		parserObj[type] = data;
	}
	

	if (needLoad.length==0){
		// 获取缓存
		orderData.getPackageCache();
		orderData.getGoodsCache();
	}else{
		let funCall = ['parserGood', 'parserOther', 'parserInventory'];
		//同步处理数据
		for (let item of funCall) {
			this[item](parserObj[item]);
		}
	}

	store.commit("setParseOk",true);
	isloading = false;
}


//以下三个方法是解析 商品 库存 other数据
orderData.parserGood = function(data){

	for(let i = 0; i < data.length; i++) {
		let item = data[i];
		item.sort = data[i].sort|0;
		orderData.goodsList[item.id] = item;//将数据id以的形式存储
		orderData.goodsIndexObj[item.id] = i;
	}
	store.commit("setOrderState",{state:"goodlist",value:true});
}

orderData.parserInventory = function(data){
	orderData.inventory = data.inventory.list;
	orderData.initGoodsInventory("get");
	store.commit("setOrderState",{state:"inventory",value:true});
}

orderData.parserOther = function(data){
	orderData.timeArea = data.timeArea;
	orderData.others = data;
        
	if(data&&data.packageArr&&data.packageArr.package){
		let packageObj = data.packageArr;
		

		let packageList = {};//套餐包括的商品列表
		let packageTagList = {};//套餐标签包括的商品列表
		
		// 处理套餐标识
		for (var i = 0; i < packageObj.packageTag.length; i++){
			let packageTag = packageObj.packageTag[i];

			if(!orderData.packageTag[packageTag.packageId]){
				orderData.packageTag[packageTag.packageId] = [];
			}
			orderData.packageTag[packageTag.packageId].push(packageTag);
		}

		// 处理套餐商品
		for (var i = 0; i < packageObj.packageGoods.length; i++){
			let packageGoods = packageObj.packageGoods[i];
			if (!orderData.packageGoods[packageGoods.packageTagId]){
				orderData.packageGoods[packageGoods.packageTagId] = [];
			}
			orderData.packageGoods[packageGoods.packageTagId].push(packageGoods);
		}

		// 处理套餐获取下标	
		packageObj.package = orderData.channel('packages', packageObj.package); // 多渠道开启则获取过滤后的套餐，未开启则获取全部套餐

		// 数据处理完成后进行排序
		packageObj.package = (packageObj.package.length === 0) ? [] :  utils.sortByAll(packageObj.package, ['sort', 'id'], true);
		let packages = [];
		for (var i = 0; i < packageObj.package.length; i++) {
			let item = packageObj.package[i];
			if(orderData.delectGoods(item)){
				packages.push(item);
				orderData.packageIndexObj[item.id] = i;
			}
		}
		
		packageObj.package = packages;

		// 将处理好的套餐数据放入data中，和getOtherList数据一并缓存
		data.packageTag = orderData.packageTag;
		data.packageGoods = orderData.packageGoods;
	}

	orderData.others = data;

	// 缓存处理好的套餐数据
	storage.localData('otherList_' + global.getShopId(), data);

	store.commit("setOrderState",{state:"otherlist",value:true});
}


/**
 * 筛选多渠道商品
 * @param {String} type //获取过滤类型
 * @param {Object} obj // 商品或套餐
 */
orderData.channel = function (type,obj) {
	if (orderData.others == null) return {};
	var channel = orderData.others.channel;
	
	if (channel && channel.status == '1') {
		if (typeof channel.goodsIds !== 'string') {
			channel.goodsIds = '';
		}
		if (typeof channel.packageIds !== 'string') {
			channel.packageIds = '';
		}

		var goodsIds = channel.goodsIds.split(',');
		var packageIds = channel.packageIds.split(',');

		var goodsAndPackages = utils.deepCopy(obj);
		var item = {};
		if(type === 'goods'){
			// 处理商品
			for(var i = 0; i < goodsIds.length; i++){
				var goods = goodsAndPackages[goodsIds[i]];
				if (goods){
					item[goodsIds[i]] = goods;
				}
			}
		}else{
			// 处理套餐
			item = [];
			for (var i = 0; i < packageIds.length; i++) {
				for (var j = 0; j < goodsAndPackages.length; j++){
					if (packageIds[i] == goodsAndPackages[j].id){
						item.push(goodsAndPackages[j]);
					}
				}
			}
		}

		return item;
	}else{
		return obj;
	}
}


/**
 * 获取多渠道分类数据
 * @param {String} pid 0是获取一级分类，pid > 0是获取二级分类
 */
function getChannelCategoryList(pid) {
	var packages = orderData.others.packageArr.package ? orderData.others.packageArr.package : [];
	var category = orderData.others.categoryArr.category;
	var categoryList = [];
	var channel = orderData.others.channel;
	if (channel && channel.status == '1') {
		var goodsCategory = orderData.others.categoryArr.goodsCategory;
		var goodsIdsStr = "," + channel.goodsIds + ","

		var addCids = "_";
		var categoryIds = {};
		var categoryPids = {};
		if (goodsIdsStr.length <= 3) {
			return [];
		}
		for (var j = 0; j < category.length; j++) {
			categoryIds[category[j].id] = category[j];
			if (category[j].pid != "0") {
				categoryPids[category[j].pid] = true;
			}
		}
		for (var i = 0; i < goodsCategory.length; i++) {
			if (goodsIdsStr.match("," + goodsCategory[i].gid + ",") && categoryIds[goodsCategory[i].cid]) {

				var category = categoryIds[goodsCategory[i].cid];
				if (addCids.match("_" + category.id + "_")) {
					continue;
				}
				if (category.pid == pid) {
					var copy = utils.deepCopy(category);
					copy.hasGoods = true;
					categoryList.push(copy)
					addCids = addCids + "_" + category.id + "_";
				} else if (pid == "0" && categoryPids[category.pid]) {
					var paCategory = categoryIds[category.pid];
					if (addCids.match("_" + paCategory.id + "_")) {
						continue;
					}
					if (paCategory && paCategory.pid == pid) {
						var copy = utils.deepCopy(paCategory);
						copy.hasGoods = true;
						categoryList.push(copy)
						addCids = addCids + "_" + paCategory.id + "_";
					}
				}
			}
		}
	} else {
		if (category && category.length > 0) {
			for (var i = 0; i < category.length; i++) {
				if (category[i].pid + '' == pid + '') {
					categoryList.push(utils.deepCopy(category[i]));
				}
			}
		}
	}
	return categoryList;
}

/**
 * 获取分类数据
 * @param {String} pid 0是获取一级分类，pid > 0是获取二级分类
 */
orderData.getCategory = function (pid) {

	var categoryList = [];
	if (orderData.others === null || pid == undefined) {
		return categoryList;
	}

	if (pid + '' === '-2') {
		categoryList.push({
			"id": "n", // 主键id
			"pid": "n", // 上级id
			"name": "全部", // 分类名称
			"sort": "0", // 排序(1-255)升序
			"hasGoods": true
		});
		categoryList.push({
			"id": "0", // 主键id
			"pid": "-2", // 上级id
			"name": "固定套餐", // 分类名称
			"sort": "1", // 排序(1-255)升序
			"status": "0", // 状态(-1.删除 0.启用 1.冻结)
			"hasGoods": true
		});
		categoryList.push({
			"id": "1", // 主键id
			"pid": "-2", // 上级id
			"name": "可选套餐", // 分类名称
			"sort": "1", // 排序(1-255)升序
			"status": "0", // 状态(-1.删除 0.启用 1.冻结)
			"hasGoods": true
		});
		return categoryList;
	} else if (pid + '' === '-1') {
		return categoryList;
	}

	var packages = orderData.others.packageArr.package ? orderData.others.packageArr.package : [];
	var categoryList = getChannelCategoryList(pid);

	if (pid + "" == "0") {
		if (packages.length >= 1) {
			categoryList.push({
				"id": "-2", // 主键id
				"pid": "-2", // 上级id
				"name": "套餐", // 分类名称
				"sort": "999", // 排序(1-255)升序
				"status": "0", // 状态(-1.删除 0.启用 1.冻结)
				"hasGoods": true
			});
		}
		// if (categoryList.length > 0 ){
		categoryList.push({
			"id": "-1", // 主键id
			"pid": "-1", // 上级id
			"name": "全部", // 分类名称
			"sort": "0", // 排序(1-255)升序
			"status": "0", // 状态(-1.删除 0.启用 1.冻结)
			"hasGoods": true
		});
		// }
	} else if (categoryList.length > 0) {
		categoryList.push({
			"id": "n", // 主键id
			"pid": "n", // 上级id
			"name": "全部", // 分类名称
			"sort": "0", // 排序(1-255)升序
			"status": "0", // 状态(-1.删除 0.启用 1.冻结)
			"hasGoods": true
		});
	}

	categoryList = utils.sortByAll(categoryList,['sort','id'],true);
	

	return categoryList;
}


/**
 * 合并商品与库存
 */
orderData.initGoodsInventory = function (source) {

	for (var i = 0; i < orderData.inventory.length; i++) {
		var item = orderData.inventory[i]; // 库存数据
		if (item == null) {
			continue;
		}

		var goods = orderData.goodsList[item.gid]; // 商品数据
		if (goods){
			goods.goodsNum = (item.goodsNum - 0);
			goods.goodsThreshold = item.goodsThreshold;
			goods.isWarn = item.isWarn;
		}
	}

	let goodsList = Object.values(orderData.goodsList);

	// 商品合并口味数据
	let list = {}; // 保存处理过的数据
	let groupGoodsObj = {}; // 多规格数据
	for (var i = 0; i < goodsList.length; i++){
		var item = goodsList[i];

		item.attr = orderData.getTasteList(item.id);
		item.isAttr = !Boolean(item.attr && item.attr.length === 0);
		item.num = '0';
		
		if (orderData.delectGoods(item)){
			list[item.id] = item;
		}else{
			// 多规格菜品
			if (!groupGoodsObj[item.groupId]){
				groupGoodsObj[item.groupId] = [];
			}
			groupGoodsObj[item.groupId].push(item);
		}
		orderData.goodsList[item.id] = item;
	}
	storage.localData('goodsList_' + global.getShopId(), Object.values(orderData.goodsList));

	// 多渠道开启获取过滤后的数据，未开启获取全部数据
	orderData.goods = Object.values(orderData.channel('goods', list));
	orderData.goods = (orderData.goods.length === 0) ? [] : utils.sortByAll(orderData.goods, ['sort', 'id'], true);

	storage.session("groupGoodsObj", groupGoodsObj);


	// 保存商品下标
	for (var i = 0; i < orderData.goods.length;i++){
		orderData.showGoodsIndex[orderData.goods[i].id] = i;
	} 
};
/**
 * 商品筛选条件
 * 
 * @param {Array} goods
 */
orderData.delectGoods = function (goods) {
	if (goods.status + '' === '-1' || goods.status === '2') return false;
	if (goods.isGroup && goods.isGroup == 0 && goods.groupId && goods.groupId > 0) return false;
	if (goods.goodsName && goods.type == 2) return false;
	
	// 自助模式过滤菜品
	var SelfHelpConfig = storage.session("SelfHelpConfig");
	var selectShop = storage.session("select-shop");
	if (selectShop && SelfHelpConfig && SelfHelpConfig.status == '1'){
		var goodsConfig = SelfHelpConfig.goodsDisplay.split(""); //获取配置信息
		if (goodsConfig != ''){
			var commonGoods = goodsConfig.indexOf("1") == -1 ? true : false; //普通菜
			var showWeight = goodsConfig.indexOf("2") == -1 ? true : false; //称重菜
			
			if (commonGoods && goods.type == '0') return false;
			if (showWeight  && goods.type == '1') return false;
		}
	}
	return true;
};

/**
 * 获取套餐缓存
 */
orderData.getPackageCache = function(){
	// 获取缓存后的数据
	orderData.others = storage.localData('otherList_' + global.getShopId()); // getOtherList数据

	// 处理套餐获取下标	
	let packages = orderData.others.packageArr.package;
		packages = orderData.channel('packages', packages); // 多渠道开启则获取过滤后的套餐，未开启则获取全部套餐
		packages = (packages.length === 0) ? [] : utils.sortByAll(packages,['sort', 'id'], true);
	for (var i = 0; i < packages.length; i++) {
		let item = packages[i];
		orderData.packageIndexObj[item.id] = i;
	}
	orderData.packageTag = orderData.others.packageTag;
	orderData.packageGoods = orderData.others.packageGoods;
};

/**
 * 获取商品缓存
 * 
 * 
 */
orderData.getGoodsCache = function(){
	var goodsList = storage.localData('goodsList_' + global.getShopId()); // getGoodsList数据

	// 商品合并口味数据
	let list = {}; // 保存处理过的数据
	let groupGoodsObj = {}; // 多规格数据
	for (var i = 0; i < goodsList.length; i++) {
		var item = goodsList[i];
		if (orderData.delectGoods(item)) {
			list[item.id] = item;
		} else {
			// 多规格菜品
			if (!groupGoodsObj[item.groupId]) {
				groupGoodsObj[item.groupId] = [];
			}
			groupGoodsObj[item.groupId].push(item);
		}
		orderData.goodsList[item.id] = item;
	}

	orderData.goods = Object.values(orderData.channel('goods', list)); // 多渠道过滤后的商品
	orderData.goods = (orderData.goods.length === 0) ? []  : utils.sortByAll(orderData.goods, ['sort', 'id'], true);
	storage.session("groupGoodsObj", groupGoodsObj);

	// 保存商品下标
	for (var i = 0; i < orderData.goods.length; i++) {
		orderData.showGoodsIndex[orderData.goods[i].id] = i;
	}
};


/**
 * 获取套餐
 * 
 * @param {String} packages 套餐信息
 */
orderData.getPackage = function (packages){
	packages.packageTag = orderData.packageTag[packages.id]; // 获取套餐标识
	for (var i = 0; i < packages.packageTag.length; i++) { 
		packages.packageTag[i].goods = [];
		// 获取标识下的商品
		var packageGoods = orderData.packageGoods[packages.packageTag[i].id];
		for (var j = 0; j < packageGoods.length; j++) {
			let goods = orderData.goodsList[packageGoods[j].gid];
			goods.packageGoodsNum = packageGoods[j].packageGoodsNum;
			goods.packageTagId = packages.packageTag[i].id;
			packages.packageTag[i].goods.push(goods);
		}
	}

	return packages;
}



/**
 *  根据分类id获取商品 
 * 
 * @param {String} id 分类id
 * @param {String} pid 分类父级id
 */
orderData.getGoodsByCategory = function (id, pid) {
	if (orderData.others === null || orderData.goods === null) return [];
	if (pid === undefined || id === undefined) return [];
	var goods = orderData.goods;
	var packages = orderData.others.packageArr && orderData.others.packageArr.package ? orderData.others.packageArr.package  : [];
	var goodsCategory = orderData.others.categoryArr.goodsCategory;
	var SelfHelpConfig = storage.session('SelfHelpConfig'); // 自助模式信息
	if (SelfHelpConfig) {
		// 筛选套餐
		var status = SelfHelpConfig.status; // 1为开启，0为关闭
		var goodsConfig = String(SelfHelpConfig.goodsDisplay).split(''); // 分割显示菜品数据
		var isPackage = goodsConfig.indexOf('3') == -1 ? false : true; // 
		packages = (isPackage && status == '1') ? packages : [];
	}

	if (pid + '' == '-1') { // 全部
		var allgoods = goods;
		if (packages && packages.length > 0) {
			allgoods = allgoods.concat(packages);
		}
		return allgoods;
	} else if (pid + '' == '-2') {

		var allpackages = [];
		if (packages && packages.length > 0) {
			allpackages = packages;
		}

		if (id + '' == '-2') {
			return allpackages;
		} else {
			var fpackages = [];
			for (var i = 0; i < allpackages.length; i++) {
				if (allpackages[i].type + '' === id + '') fpackages.push(allpackages[i]);
			}
			return fpackages;
		}
	} else {
		var goodsList = [];
		var allgoods = goods;
		var idlist = [id];
		if (pid + '' == 0) {
			var c2Arr = orderData.getCategory(id);
			for (var i = 0; i < c2Arr.length; i++) {
				idlist.push(c2Arr[i].id);
			}
		}

		var dec = {};
		for (var k = 0; k < idlist.length; k++) {
			var id = idlist[k];
			for (var i = 0; i < goodsCategory.length; i++) {
				if (goodsCategory[i].cid + '' === id + '') {
					var item = orderData.goods[orderData.showGoodsIndex[goodsCategory[i].gid]];
					if (item === undefined) continue;
					if (dec[item.id]) continue;
					dec[item.id] = true;
					goodsList.push(item);
				}
			}
		}
		
		return goodsList;
	}
};



/**
 * 通过商品id获取到对应的口味名称
 * 
 * @param {String} id 商品gid
 */
orderData.getTasteList = function (id) {
	var tasteInfo = []; //返回的信息
	if (orderData.others == null) return;
	if (orderData.others.radio == null) return;
	var aboutTasteList = orderData.others.radio.goodsAttr; //关联口味列表
	var attrId = []; //通过商品的id找出对应的口味id

	for (var i = 0; i < aboutTasteList.length; i++) {
		if (aboutTasteList[i].gid + "" === id + "") {
			attrId.push(aboutTasteList[i].attrId + "");
		}
	}
	var aboutGoodsRadio = orderData.others.radio.goodsRadio; //口味的列表
	for (var i = 0; i < aboutGoodsRadio.length; i++) {
		for (var j = 0; j < attrId.length; j++) {
			if (aboutGoodsRadio[i].id + "" === attrId[j] + "") {
				var findAttr = aboutGoodsRadio[i];
				var getOneTaste = {};
				if (findAttr.name == null || findAttr.name == undefined || findAttr.name == "") {
					return [];
				} else {
					getOneTaste.name = findAttr.name;
				}
				if (findAttr.options == null || findAttr.options == undefined || findAttr.options == "") {
					return [];
				} else {
					var options = findAttr.options;
					var oparr = [];
					var reg = /([^:]*):([\d.]+)\|?/g;
					
					var num = 0;
					options.replace(reg, (...args) => {
						var obj = {};
						obj.name = args[1];
						obj.price = args[2];
						obj.id = attrId[j];
						obj.attrStatu = false;
						oparr[num++] = obj;
					})

					var attrObj = {
						type: findAttr.optionsType,
						selectNum: 0
					};
					var attrPrce = findAttr.priceRange ? findAttr.priceRange.split(",") : '';
					attrObj.minPrice = attrPrce[0];
					attrObj.maxPrice = attrPrce[1];
					if (findAttr.optionsType == 1) { //指定必须选中
						attrObj.rules = ("必选" + findAttr.optionsRange + "种口味");
						attrObj.maxNum = findAttr.optionsRange;
						//							attrObj.maxPrice = findAttr.priceRange;
					} else if (findAttr.optionsType == 2) { //指定选中区间
						var attrOptions = findAttr.optionsRange.split(",");
						attrObj.rules = ("可选择" + attrOptions[0] + "-" + attrOptions[1] + "种口味");
						attrObj.minNum = attrOptions[0];
						attrObj.maxNum = attrOptions[1];
					}
					getOneTaste.attrObj = attrObj;
					getOneTaste.options = oparr;
					getOneTaste.attr = findAttr.attr;
					getOneTaste.id = findAttr.id;
				}
				tasteInfo.push(getOneTaste);
			}
		}

	}
	
	return tasteInfo;
};

orderData.getGoodsNumInCar = function (id, type) {
	var num = 0;
	var list = [];
	if (type) {
		list = utils.deepCopy(orderData.oPackageList);
	} else {
		list = utils.deepCopy(orderData.oGoodsList);
	}
	for (var i = 0; i < list.length; i++) {
		if (list[i].id == id) {
			num += list[i].num;
		}
	}
	return num;
}


/**
 * 检测库存并提示
 */
orderData.checkGoodsNum = function (that,goods) {
	// debugger
	if (goods.packageName) {
		return true;
	} else {
		if (goods.status == 1) {
			that.$store.commit("setWin",{content:goods.goodsName + '已估清'})
			return false;
		}
		if (goods.isStock == 1 && goods.goodsNum == 0) {
			that.$store.commit("setWin",{content:goods.goodsName + '已售完'})
			return false;
		}
		if (goods.isStock == 1 && goods.num >= goods.goodsNum) {
			that.$store.commit("setWin",{content:goods.goodsName + '库存不足'})
			return false;
		}
		return true;
	}
}

/**
 * 转换数据格式提交后台
 */
orderData.getCurrentTableUpdata = function (gl, pl) {
	var getAttr = function (arr) {
		var ret = {};
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].attrStatu) {
				if (!ret[arr[i].id]) {
					ret[arr[i].id] = [arr[i].name + ":" + (arr[i].price ? arr[i].price : 0)];
				} else {
					ret[arr[i].id].push(arr[i].name + ":" + (arr[i].price ? arr[i].price : 0));
				}
			}
		}
		var attrs = [];
		for (var key in ret) {
			attrs.push({
				id: key,
				name: ret[key]
			});
		}
		return attrs;

	};
	var getAttrs = function (attrs) {
		var ret = [];
		if (attrs && attrs.length > 0) {
			for (var i = 0; i < attrs.length; i++) {
				ret = ret.concat(getAttr(attrs[i].options));
			}
		}
		return ret;
	};
	var getGoods = function (goods) {
		var ret = [];
		for (var i = 0; i < goods.length; i++) {
			var item = goods[i];
			var obj = {
				gid: item.id,
				num: item.num,
				name: item.name,
				waitNum: item.waitNum ? item.waitNum : 0,
				type: item.type,
				isVip: item.isVip,
				vipPrice: item.vipPrice
			}
			obj.attr = getAttrs(item.attr);
			ret.push(obj);

		}
		return ret;
	};

	var getPackageItemGoods = function (goods) {
		var ret = [];
		for (var i = 0; i < goods.length; i++) {
			var item = goods[i];
			var obj = {
				gid: item.id,
				num: item.num,
				name: item.goodsName,
				waitNum: item.waitNum ? item.waitNum : 0,
				type: item.type,
				odid: ""
			}
			obj.attr = getAttrs(item.attr);
			ret.push(obj);
		}

		return ret;
	};

	var getPackageGoods = function (packageTag) {
		var ret = [];
		for (var i = 0; i < packageTag.length; i++) {
			var packageTagGoods = getPackageItemGoods(packageTag[i].goods);
			ret = ret.concat(packageTagGoods);
		}
		return ret;
	};

	var getPackages = function (packages) {
		var ret = [];
		for (var i = 0; i < packages.length; i++) {
			var item = packages[i];
			ret.push({
				packageId: item.id,
				num: item.num,
				waitNum: item.waitNum ? item.waitNum : 0,
				odid: "0",
				goods: getPackageGoods(item.packageTag)
			});
		}
		return ret;
	};

	var retObj = {
		goods: getGoods(gl),
		package: getPackages(pl)
	};

	return JSON.stringify(retObj);
};

export default orderData;