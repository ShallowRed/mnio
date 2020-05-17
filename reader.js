let fs = require('fs');

const read = (file, cb) =>
  fs.readFile(file, 'utf8', (err, data) => {
    if (!err) cb(data.toString().split('\n'))
    else console.log(err)
  });


// read(__dirname + '/js.txt', data => {
//
//   let count = 0;
//   let count2 = 0;
//   let lastindex = 0;
//
//   // data.forEach((item, i) => {
//   //
//   //   if (item[0] == '#') {
//   //     console.log(item);
//   //     if (count % 5 == 0) {
//   //       if (count !==0) ++lastindex;
//   //       pokedex[lastindex] = {
//   //         palette: [],
//   //         description: ''
//   //       };
//   //     }
//   //     pokedex[lastindex].palette.push(item);
//   //     count++;
//   //   }
//   // });
//
//   data.forEach((item, i) => {
//     if (item && item.length > 7) {
//       if (pokedex[count2]) pokedex[count2].description += item;
//     }
//     if (item && item.length > 7) count2++;
//   });
//
//   fs.writeFile(__dirname + '/mn2.js', JSON.stringify(pokedex), function(err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     console.log(data);
//   });
//   // console.log(pokedex);
// });

// read(__dirname + '/mn.txt', data => {
// let temperatures = [];
// for (let temp in data) {
//   temperatures.push(+data[temp].match(/\d+/g));
// }
// //your 'loop' logic goes here, y = temperatures
// console.log(temperatures);
// });

const pokedex = require("./pokedex");

const poke2 = pokedex.map((e, i) => {
  const desc = e.description.split(",")
  return {
    palette: e.palette,
    description: desc[0] + "," + desc[1] + "," + desc[2]
  }
})

fs.writeFile("./mn3.js", JSON.stringify(poke2), e=>(console.log(e)));
// console.log(pokedex);
console.log(poke2);
