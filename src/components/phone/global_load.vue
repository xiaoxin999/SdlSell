<template>
  <div id='global_loader'>
      
  </div>
</template>

<script>
    
</script>

<style scoped lang='less'>
    
    
@size: 1.8rem;
@thickness: 0.4rem;

@lat: (@size - @thickness) / 2;
@offset: @lat - @thickness;



#global_loader {
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
 
  background-color: rgba(0,0,0,0.5);
  z-index:2000;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: @thickness;
    height: @thickness;
    border-radius: @thickness / 2;
    transform: translate(-50%, -50%);
  }
  
  &:before {
    animation: before 2s infinite;
  }
  
  &:after {
    animation: after 2s infinite;
  }
}

@keyframes before {
  0% {
    width: @thickness;
    box-shadow:
      @lat (-@offset) hsla(337, 84%, 48%, 0.75),
      (-@lat) @offset hsla(190, 61%, 65%, 0.75);
  }
  35% {
    width: @size;
    box-shadow:
      0 (-@offset) hsla(337, 84%, 48%, 0.75),
      0   @offset  hsla(190, 61%, 65%, 0.75);
  }
  70% {
    width: @thickness;
    box-shadow:
      (-@lat) (-@offset) hsla(337, 84%, 48%, 0.75),
      @lat @offset hsla(190, 61%, 65%, 0.75);
  }
  100% {
    box-shadow:
      @lat (-@offset) hsla(337, 84%, 48%, 0.75),
      (-@lat) @offset hsla(190, 61%, 65%, 0.75);
  }
}

@keyframes after {
  0% {
    height: @thickness;
    box-shadow:
      @offset @lat hsla(160, 50%, 48%, 0.75),
      (-@offset) (-@lat) hsla( 41, 82%, 52%, 0.75);
  }
  35% {
    height: @size;
    box-shadow:
        @offset  0 hsla(160, 50%, 48%, 0.75),
      (-@offset) 0 hsla( 41, 82%, 52%, 0.75);
  }
  70% {
    height: @thickness;
    box-shadow:
      @offset (-@lat) hsla(160, 50%, 48%, 0.75),
      (-@offset) @lat hsla( 41, 82%, 52%, 0.75);
  }
  100% {
    box-shadow:
      @offset @lat hsla(160, 50%, 48%, 0.75),
      (-@offset) (-@lat) hsla( 41, 82%, 52%, 0.75);
  }
}








</style>
