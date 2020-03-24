const mongoose = require("mongoose");
require("../Models/Gauging");
const Gauging = mongoose.model("gaugings");

const handlebars = require("handlebars");

exports.pdf = async (month,auxperiod) => {
  var auxperiod = auxperiod.split("-");
  var peri = auxperiod[1]+'/'+auxperiod[0];
  let html = `
  <h2>Aferição de Balança Periodo: {{peri}} </h2>
  <table>
  <thead>
    <tr>
      <th scope="col">Data</th>
      <th scope="col">Usuario</th>
      <th scope="col">Periodo</th>
      
    </tr>
  </thead>
  {{#each gauging}}
  <tbody>
    <tr>
      <td>{{date}}</td>
      <td>{{user}}</td>
      <td>{{period}}</td>
    </tr>    
  </tbody>
  {{else}}
  {{/each}}
</table>

<style>
table {
  width:100% !important;
  text-align: center;
  border: solid 2px black;
}
td{  
  border: solid 2px black;
}
</style>
  
  `;
  const listGaugind = await Gauging.find({date:month}).sort({date:'asc'});
  gauging = [];
  var map = listGaugind.map(obj => {
    var newDate = obj.date.split("-");
    gauging.push({
      date: newDate[2] + "/" + newDate[1] + "/" + newDate[0],
      user: obj.user,
      period: obj.period
    });
  });

  var template = handlebars.compile(html);
  var parsehtml = template({ gauging, peri });
  return parsehtml;
};
