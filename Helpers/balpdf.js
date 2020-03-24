
const mongoose = require("mongoose");
require("../Models/Balance");
const Balance = mongoose.model("balances");

const handlebars = require("handlebars");

exports.pdf = async (month,auxperiod) => {
  var auxperiod = auxperiod.split("-");
  var peri = auxperiod[1]+'/'+auxperiod[0];
  let html = `

  <table>
  {{#if bal}}
  <thead>
    <tr>
      <th>Data</th>
      <th>Usúario</th>
      <th colspan="11">Balanças</th>
    </tr>
  </thead>
  {{else}}
  {{/if}}

  <tbody>
  	<h2>Limpeza de Balança Periodo: {{peri}} </h2>
    {{#each bal}}
    <tr>
      <td scope="col">
        {{date}}
      </td>
      <td scope="col">{{user}}</td>
      <td scope="col" {{#if bal10 }}style="background:green" {{else}}{{/if}}>Bal10</td>
      <td scope="col" {{#if bal11 }}style="background:green" {{else}}{{/if}}>Bal11</td>
      <td scope="col" {{#if bal12 }}style="background:green" {{else}}{{/if}}>Bal12</td>
      <td scope="col" {{#if bal13 }}style="background:green" {{else}}{{/if}}>Bal13</td>
      <td scope="col" {{#if bal14 }}style="background:green" {{else}}{{/if}}>Bal14</td>
      <td scope="col" {{#if bal15 }}style="background:green" {{else}}{{/if}}>Bal15</td>
      <td scope="col" {{#if bal16 }}style="background:green" {{else}}{{/if}}>Bal16</td>
      <td scope="col" {{#if bal17 }}style="background:green" {{else}}{{/if}}>Bal17</td>
      <td scope="col" {{#if bal18 }}style="background:green" {{else}}{{/if}}>Bal18</td>
      <td scope="col" {{#if bal19 }}style="background:green" {{else}}{{/if}}>Bal19</td>
      <td scope="col" {{#if bal20 }}style="background:green" {{else}}{{/if}}>Bal20</td>
    </tr>
  </tbody>
    {{else}}
    <div class="btn btn-info btn-block">Nenhum Dado Encontrado</div>
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
  const listBalance = await Balance.find({date:month}).sort({date:'asc'});
  
  bal = [];
  var map = listBalance.map(obj => {
    var newDate = obj.date.split("-");
    bal.push({
      date: newDate[2] + "/" + newDate[1] + "/" + newDate[0],
      user: obj.user,
      bal10: obj.bal10,
      bal11: obj.bal11,
      bal12: obj.bal12,
      bal13: obj.bal13,
      bal14: obj.bal14,
      bal15: obj.bal15,
      bal16: obj.bal16,
      bal17: obj.bal17,
      bal18: obj.bal18,
      bal19: obj.bal19,
      bal20: obj.bal20,
    });
  });

  var template = handlebars.compile(html);
  var parsehtml = template({ bal, peri });
  return parsehtml;
};
