var path = 'M139.320029,7.31043095 L138.373972,6.91446813 C138.148677,6.8268585 137.968261,6.6507861 137.855614,6.43090448 L137.855614,6.38709966 C137.765848,6.14487807 137.765848,5.88119603 137.855614,5.66131441 L138.238435,4.73798752 C138.440848,4.43050506 138.373963,4.03454225 138.125787,3.79232065 L137.067083,2.75905295 C136.818899,2.51683136 136.41409,2.47303094 136.121026,2.64911214 L135.15208,3.02273499 C134.633722,3.22028543 134.070486,2.97893017 133.868081,2.49537091 L133.462371,1.59350447 C133.394607,1.24134206 133.07955,1 132.718718,1 L131.209425,1 C130.848594,1 130.533542,1.24222159 130.465773,1.57204402 L130.060063,2.49537091 C129.834768,2.97893457 129.271532,3.19881619 128.776064,3.02273499 L127.830007,2.64911214 C127.536944,2.4515617 127.131234,2.49536652 126.86106,2.75905295 L125.802356,3.79232065 C125.554172,4.03454225 125.509293,4.42962554 125.689709,4.71564755 L126.07253,5.66131441 C126.274943,6.16721804 126.027646,6.71692209 125.532183,6.91446374 L124.608115,7.31042655 C124.247283,7.37656255 124,7.6840494 124,8.0362118 L124,9.50924274 C124,9.86140514 124.248184,10.1688876 124.586126,10.235028 L125.532183,10.6309908 C126.027651,10.8508724 126.252945,11.4005765 126.07253,11.8841401 L125.689709,12.807467 C125.487295,13.1149495 125.532179,13.4894519 125.802356,13.7531339 L126.86106,14.7864016 C127.109245,15.0286232 127.514054,15.0724236 127.807117,14.8963424 L128.776064,14.5227196 C129.294422,14.3251691 129.857658,14.5665244 130.060063,15.0500836 L130.465773,15.9519501 C130.533537,16.3041125 130.848594,16.5454545 131.209425,16.5454545 L132.718718,16.5454545 C133.07955,16.5454545 133.394602,16.303233 133.462371,15.9734105 L133.868081,15.0500836 C134.093376,14.56652 134.656612,14.3466384 135.15208,14.5227196 L136.098137,14.8963424 C136.3912,15.0938928 136.79691,15.050088 137.067083,14.7864016 L138.125787,13.7531339 C138.373972,13.5109123 138.418851,13.115829 138.238435,12.829807 L137.855614,11.8841401 C137.653201,11.3782365 137.900497,10.8285325 138.395961,10.6309908 L139.320029,10.235028 C139.68086,10.168892 139.928144,9.86140514 139.928144,9.50924274 L139.928144,8.0362118 C139.928144,7.68490694 139.680838,7.37656695 139.320029,7.31042655 L139.320029,7.31043095 Z M131.848651,12.0395257 C130.06559,12.0395257 128.616853,10.6255963 128.616853,8.88537549 C128.616853,7.1451547 130.06559,5.7312253 131.848651,5.7312253 C133.631711,5.7312253 135.080448,7.1451547 135.080448,8.88537549 C135.080448,10.6255963 133.631711,12.0395257 131.848651,12.0395257 Z'

var coords = path.split(' ').map(function (s) {
  var result = {}
  result.action = isNaN(s.charAt(0)) ? s.charAt(0) : ''
  var nums = s.split(',')
  if (nums.length == 2) {
    result.hasCoords = true
    result.x = parseFloat(nums[0])
    if (isNaN(result.x)) {
      result.x = parseFloat(nums[0].slice(1))
    }
    result.y = parseFloat(nums[1])
  }
  return result
})

var minX = Number.MAX_VALUE
var minY = Number.MAX_VALUE

for (var i = 0; i < coords.length; i++) {
  var ci = coords[i]
  if (ci.hasCoords) {
    if (minX > ci.x) {
      minX = ci.x
    }
    if (minY > ci.y) {
      minY = ci.y
    }
  }
}

console.log(minX, minY)

for (var i = 0; i < coords.length; i++) {
  var ci = coords[i]
  if (ci.hasCoords) {
    ci.x -= minX
    ci.y -= minY
  }
}

function sixPlaces(n){
  return Math.floor(n * 1000000) / 1000000
}

var path2 = []
for (var i = 0; i < coords.length; i++) {
  var ci = coords[i]
  if (ci.hasCoords) {
    path2.push('' + ci.action + sixPlaces(ci.x) + ',' + sixPlaces(ci.y))
  } else {
    path2.push(ci.action)
  }
}

console.log(path2.join(' '))

