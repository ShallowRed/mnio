let fs = require('fs');

const read = (file, cb) =>
  fs.readFile(file, 'utf8', (err, data) => {
    if (!err) cb(data.toString().split('\n'))
    else console.log(err)
  });


// let pokedex = new Array(50);

const pokedex = [{
  "palette": ["#0b2536", "#b7b4c7", "#021564", "#164a50", "#334a93"],
  "description": ""
}, {
  "palette": ["#ba2420", "#6e1a17", "#cd4039", "#db6352", "#d4cdbb"],
  "description": ""
}, {
  "palette": ["#e33d33", "#f59d52", "#295ba6", "#ffe169", "#262630"],
  "description": ""
}, {
  "palette": ["#731F2E", "#F2BC8D", "#F27777", "#764652", "#92aad2"],
  "description": ""
}, {
  "palette": ["#F2D544", "#BF7330", "#0a0b0d", "#c8bc92", "#896251"],
  "description": ""
}, {
  "palette": ["#607EA6", "#96B9D9", "#F2A35E", "#fed367", "#677655"],
  "description": ""
}, {
  "palette": ["#74418f", "#A65369", "#BF9180", "#dd745e", "#2c1e3d"],
  "description": ""
}, {
  "palette": ["#8688A6", "#F2B28D", "#BF4141", "#303b60", "#6f222a"],
  "description": ""
}, {
  "palette": ["#22398e", "#2c1f19", "#F2B90C", "#518845", "#c5681b"],
  "description": ""
}, {
  "palette": ["#829984", "#732C39", "#F24C3D", "#fcf5b5", "#364e72"],
  "description": ""
}, {
  "palette": ["#1C2B59", "#3C5973", "#F2C6A0", "#aa4c49", "#909590"],
  "description": ""
}, {
  "palette": ["#F2D06B", "#204E54", "#A6442E", "#fbc88c", "#080c18"],
  "description": ""
}, {
  "palette": ["#791C1E", "#012340", "#D0A47E", "#b48072", "#8e876e"],
  "description": ""
}, {
  "palette": ["#9E63A6", "#305AD9", "#D99036", "#37253d", "#37253d"],
  "description": ""
}, {
  "palette": ["#72A6D4", "#22402F", "#F2D7B6", "#174181", "#a090aa"],
  "description": ""
}, {
  "palette": ["#98728c", "#f0ca36", "#D96236", "#5f71b5", "#834f40"],
  "description": ""
}, {
  "palette": ["#0F468C", "#39403E", "#952522", "#aebcbd", "#af684a"],
  "description": ""
}, {
  "palette": ["#A64153", "#41271A", "#C74E41", "#b5725f", "#9d3333"],
  "description": ""
}, {
  "palette": ["#CD5E2D", "#615E2A", "#D9AB53", "#9f892e", "#815737"],
  "description": ""
}, {
  "palette": ["#26241E", "#A9BED9", "#A69460", "#687899", "#e3e4f0"],
  "description": ""
}, {
  "palette": ["#0A2D73", "#1c2443", "#FCF2ED", "#D91E1E", "#731626"],
  "description": ""
}, {
  "palette": ["#C93426", "#50a826", "#0D1440", "#b61a5b", "#0022c6"],
  "description": ""
}, {
  "palette": ["#070662", "#F2F2F2", "#5B89A6", "#2e5d77", "#b09d8e"],
  "description": ""
}, {
  "palette": ["#D21608", "#72AE5C", "#F7CA12", "#103b99", "#040500"],
  "description": ""
}, {
  "palette": ["#696187", "#BA7647", "#A84047", "#412336", "#d3c9bf"],
  "description": ""
}, {
  "palette": ["#F21313", "#355493", "#688061", "#000000", "#a49d18"],
  "description": ""
}, {
  "palette": ["#FBBB47", "#BBCE4A", "#902B2B", "#1f3a2b", "#e0dfdb"],
  "description": ""
}, {
  "palette": ["#C39A21", "#C75356", "#376BB7", "#050505", "#c6b28d"],
  "description": ""
}, {
  "palette": ["#F0C8A5", "#1D1D19", "#D40B0B", "#f4eed4", "#cdac89"],
  "description": ""
}, {
  "palette": ["#5A3B56", "#F2CDAC", "#D99E91", "#d45945", "#686b88"],
  "description": ""
}]

read(__dirname + '/mn.txt', data => {

  let count = 0;
  let count2 = 0;
  let lastindex = 0;

  // data.forEach((item, i) => {
  //
  //   if (item[0] == '#') {
  //     console.log(item);
  //     if (count % 5 == 0) {
  //       if (count !==0) ++lastindex;
  //       pokedex[lastindex] = {
  //         palette: [],
  //         description: ''
  //       };
  //     }
  //     pokedex[lastindex].palette.push(item);
  //     count++;
  //   }
  // });

  data.forEach((item, i) => {
    if (item && item.length > 7) {
      if (pokedex[count2]) pokedex[count2].description += item;
    }
    if (item && item.length > 7) count2++;
  });

  fs.writeFile(__dirname + '/mn2.js', JSON.stringify(pokedex), function(err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
  });
  // console.log(pokedex);
});

// read(__dirname + '/mn.txt', data => {
// let temperatures = [];
// for (let temp in data) {
//   temperatures.push(+data[temp].match(/\d+/g));
// }
// //your 'loop' logic goes here, y = temperatures
// console.log(temperatures);
// });
