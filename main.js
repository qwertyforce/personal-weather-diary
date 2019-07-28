Vue.component('reactive', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],

  data: function () {
    return {
      options: {

        scales: {
          yAxes: [{
            gridLines: {
              display: true
            },
            ticks: {
                suggestedMax: 50,    // minimum will be 0, unless there is a lower value.
                // OR //
            }
          }],
          xAxes: [{
            gridLines: {
              display: true,
            },
            ticks: {
                                callback: function(value, index, values) {
                                  if (this.chart.id===0){return values[index]}
                                     if((index+1)%2===0){
                                      return " "
                                    }else{
                                      return values[index/2]
                                    }
                                    }
                   }
                            
          }]
        },
        legend: {
          display: true
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function(tooltipItems, data) {
              //console.log(tooltipItems)
              return tooltipItems.yLabel.toString();
            },
            title: function(tooltipItems, data) {
              if (this._chart.id===0){return tooltipItems[0].xLabel.toString() }
              if ((tooltipItems[0].index+1)%2===0){
                return (data.labels[tooltipItems[0].index]/2).toString()
              }else{
                return tooltipItems[0].xLabel.toString()
              }
        }

          }
        },
        responsive: true,
        maintainAspectRatio: false,
          zoom: {
          enabled: true,
          drag:true,
          mode: 'x',
          sensitivity:0.001
        },
        height: 200
      }
    }
  },
  mounted () {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
  }
})
Vue.component('cell-grid', {
  template: `<div style="display: flex;" v-if="check_exist()" >
  <select  id="smile" class="custom-select" v-model="weather1" >
          <option value="0">(__)</option>
          <option value="1">(💧)</option>
          <option value="2">(❄)</option>
          </select>
  <div id="cntr" v-show="edit == false">
  <label id="cntr" @dblclick="editing">{{ cell_day }}</label>
      </div> 
      <input id="cntr" ref="cellinput" type="text" v-show="edit == true"
       v-model="cell_day" @blur="edit = false" @keyup.enter="edit = false" @change="send" style="width: 39px;height: 25px;"> 
       <select  id="smile" class="custom-select" v-model="weather2" >
          <option value="0">(__)</option>
          <option value="1">(💧)</option>
          <option value="2">(❄)</option>
          </select>
          <select  id="smile" class="custom-select" v-model="weather3" >
          <option value="0">(__)</option>
          <option value="1">(💧)</option>
          <option value="2">(❄)</option>
          </select>
       <div id="cntr" v-show="edit2 == false">
  <label id="cntr" @dblclick="editing2">{{ cell_night }}</label>
      </div>

      <input id="cntr" ref="cellinput2" type="text" v-show="edit2 == true" @change="send" 
       v-model="cell_night" @blur="edit2 = false" @keyup.enter="edit2 = false" style="width: 39px;height: 25px;"> 
       <div>
       <select  id="smile" class="custom-select" v-model="weather4" >
          <option value="0">(__)</option>
          <option value="1">(💧)</option>
          <option value="2">(❄)</option>
          </select>
          </div>
       </div>
       `
       ,
  props: ['k','f'],
  data: function() {
    return {
      edit: false,
      edit2:false
    }
  },
  computed: {
    cell_day: {
      get: function() {
        console.log(this.k,this.f)
        if(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]===undefined){return 0}else{
          return this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["day_temp"]
        }
        
      },
      set: function(newCellValue) {
        console.log("set", newCellValue)
        Vue.set(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f], "day_temp", newCellValue)
       
      }
    },
    cell_night: {
      get: function() {
        if(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]===undefined){return 0}else{
          return this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["day_night"]
        }
      },
      set: function(newCellValue) {
        console.log("set", newCellValue)
        Vue.set(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f], "day_night", newCellValue)
     
      }
    },
    weather1:{
      get:function(){return this.weather('weather_type1')},
      set:function(value){
        Vue.set(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f], 'weather_type1',value)
        this.send();
      }
    },
     weather2:{
      get:function(){return this.weather('weather_type2')},
      set:function(value){
        Vue.set(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f], 'weather_type2',value)
        this.send();
      }
    },
     weather3:{
      get:function(){return this.weather('weather_type3')},
      set:function(value){
        Vue.set(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f], 'weather_type3',value)
        this.send();
      }
    },
     weather4:{
      get:function(){return this.weather('weather_type4')},
      set:function(value){
        Vue.set(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f], 'weather_type4',value)
        this.send();
      }
    },
  },
  methods: {
   check_exist: function() {
     if(this.$root.$data.weather_data[this.$root.$data.month.toString()]===undefined){
      return false;
     }
 
    if(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()]!==undefined){
      if(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]!==undefined){
        return true
      }
    }
    return false
  }, 
  focused: function() {
    console.log('focused')
  },
   weather:function(type){
      if(this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]===undefined){
        return 0
      }else{
        return this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f][type]
      }
    },
   editing: function() {
      this.edit = true;
      this.$nextTick(function () {
        this.$refs.cellinput.focus()
      })
   },
   editing2: function() {
      this.edit2 = true;
      this.$nextTick(function () {
        this.$refs.cellinput2.focus()
      })
   },
   send:function(){
 $.ajax({
       url: 'http://yourserverip:9080/set_weather',
       type: 'POST',
        data:  {day: this.f,
       year:this.k.toString(),
       month:this.$root.$data.month.toString(),
       weathertype1:this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["weather_type1"],
       weathertype2:this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["weather_type2"],
       weathertype3:this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["weather_type3"],
       weathertype4:this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["weather_type4"],
       temp:this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["day_temp"],
       temp2:this.$root.$data.weather_data[this.$root.$data.month.toString()][this.k.toString()][this.f]["day_night"]
},
       success: function(response) {
            alert("Успешно")
        }.bind(this)
     });
  }
  }
})



const Diary = { template: `
<table class="table" >
  <thead>
    <tr>
      <th style="border-right: 2px solid rgb(176, 179, 181);padding:0px;border-top: 2px solid rgb(176, 179, 181);border-bottom: 2px solid rgb(176, 179, 181);" >Число</th>
      <th v-for="gg  in get_number_of_years()" style="border-right: 2px solid rgb(176, 179, 181);padding:0px;border-top: 2px solid rgb(176, 179, 181);border-bottom: 2px solid rgb(176, 179, 181);">{{get_year(gg-1)}}</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for='i in 31'>
      <th scope="row" style="border-right: 2px solid rgb(176, 179, 181);border-bottom: 2px solid rgb(176, 179, 181);vertical-align: inherit;padding:0px;">
      <span style="padding-left: 5px;">{{i}}</span>
      </th>
      <td v-for="nn  in  get_number_of_years()" style="border-right: 2px solid rgb(176, 179, 181);border-bottom: 2px solid rgb(176, 179, 181);padding:0px;">
      <cell-grid :k=get_offset()+nn :f=i></cell-grid>
      </td>
    </tr>
  </tbody>
</table>
`,
data: function () {
 return{
  edit:false
  }  
},
methods:{
  get_year:function(gg){
    console.log(parseInt(this.$root.$data.beginyear)+gg);
    return parseInt(this.$root.$data.beginyear)+gg;
  },
  get_number_of_years(){
    return (parseInt(this.$root.$data.endyear)-parseInt(this.$root.$data.beginyear)+1)
  },
  get_offset(){
    return parseInt(this.$root.$data.beginyear)-1
  }

}
// created(){
//    $.ajax({
//             url: 'https://backend.4battle.ru:8080/leaderboard',
//         }).done(function(data) {
//   var x=JSON.parse(data)
//   for (var i = 0; i < x.length; i++) {
//    x[i].Username=escapeHtml(x[i].Username)
//   }
//   this.Leaderboard=x
// }.bind(this));
// }
}
const set_weather = { 
  name:"setweather",
  template: `
<div style="
    margin-left: 10px;
">
<form  v-on:submit.prevent>
<div class="form-group">
    <label for="exampleFormControlInput1">Число</label>
    <input type="number" v-model="day" class="form-control" id="exampleFormControlInput1" placeholder="Число" required> 
  </div>
  <div class="form-group">
    <label for="exampleFormControlSelect1">Месяц</label>
    <select v-model="month" class="form-control" id="exampleFormControlSelect1" required>
      <option v-for="(n,k) in months" :value=k+1>{{n}}</option>
    </select>
  </div>
  <div class="form-group">
    <label for="exampleFormControlInput1">Год</label>
    <input v-model="year" type="number" class="form-control" id="exampleFormControlInput1" placeholder="Год" required >
  </div>
  <div style="display: flex;">
  <select id="smile" class="custom-select" v-model="weathertype1">
    <option value="0">(__)</option>
    <option value="1">(💧)</option>
    <option value="2">(❄)</option>
</select>
<div id="cntr">
    <input type="number" v-model="temp" class="form-control" id="exampleFormControlInput1" placeholder="Температура (Утро)" > 
</div>
<select id="smile" class="custom-select" v-model="weathertype2">
    <option value="0">(__)</option>
    <option value="1">(💧)</option>
    <option value="2">(❄)</option>
</select>
<select id="smile" class="custom-select" v-model="weathertype3">
    <option value="0">(__)</option>
    <option value="1">(💧)</option>
    <option value="2">(❄)</option>
</select>
<div id="cntr">
    <input type="number" v-model="temp2" class="form-control" id="exampleFormControlInput1" placeholder="Температура (День)" > 
</div>

<div>
    <select id="smile" class="custom-select" v-model="weathertype4">
        <option value="0">(__)</option>
        <option value="1">(💧)</option>
        <option value="2">(❄)</option>
    </select>
</div>
</div>
  <button type="submit" class="btn btn-primary" @click="send" style="
    margin-top: 5px;
">Отправить</button>
</form>
</div>
`,
data: function () {
 return{
  day:new Date().getDate(),
  year:new Date().getFullYear(),
  month:new Date().getMonth()+1,
  weathertype1:0,
  weathertype2:0,
  weathertype3:0,
  weathertype4:0,
  temp:null,
  temp2:null,
  months:['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
  }  
},
methods:{
  send:function(){
 $.ajax({
       url: 'http://yourserverip:9080/set_weather',
       type: 'POST',
        data:  {day: this.day,
       year:this.year,
       month:this.month,
       weathertype1:this.weathertype1,
       weathertype2:this.weathertype2,
       weathertype3:this.weathertype3,
       weathertype4:this.weathertype4,
       temp:this.temp,
       temp2:this.temp2
},
       success: function(response) {
        if(this.$root.$data.weather_data[this.month][this.year]===undefined){
          console.log(111)
          this.$root.$data.weather_data[this.month][this.year]={};
        }
        console.log(222)
        Vue.set(this.$root.$data.weather_data[this.month][this.year],this.day,{
          day_night:this.temp2,
          day_temp:this.temp,
          weather_type1:this.weathertype1,
          weather_type2:this.weathertype2,
          weather_type3:this.weathertype3,
          weather_type4:this.weathertype4,
        });
            alert("Успешно")
        }.bind(this)
     });
  }
}
}




const Graphics={template:`
  <div>
   <button @click="reset(0)">Сбросить масштаб</button>
   <button @click="add(0)">Добавить год</button>
    <select  class="custom-select" v-model="chooseyear">
           <option  v-for="n in new Date().getFullYear()-last_year_in_db+1 " :value="n+last_year_in_db-1" >{{n+last_year_in_db-1}}</option>
          </select>
  <reactive :chart-data="this.$root.fill_years()"></reactive>
  <button @click="reset(1)">Сбросить масштаб</button>
   <button @click="add(1)">Добавить год</button>
    <select  class="custom-select" v-model="chooseyear2">
           <option  v-for="n in new Date().getFullYear()-last_year_in_db+1 " :value="n+last_year_in_db-1" >{{n+last_year_in_db-1}}</option>
          </select>
  <reactive :chart-data="this.$root.fill_month()"></reactive>
   
</div>
`,
created () {
  this.chooseyear=new Date().getFullYear()-1
this.chooseyear2=new Date().getFullYear()-1
this.last_year_in_db=this.$root.last_year_in_db
},
data:function () {
  return{
last_year_in_db:1970
  }
},

methods:{
  reset:function(el){
    this.$root.$children[this.$root.$children.length-1].$children[el].$data._chart.resetZoom()
  },
  add:function(el){
    var chooseyear=this.chooseyear
    var chooseyear2=this.chooseyear2
      var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var color ="rgb(" + r + "," + g + "," + b + ")";
    console.log(chooseyear)
    if (el===0){ 
let x=[];
var data_temp=[];
var months_arr=[];
for (i=1;i<=12;i++){
   if(this.$root.$data.weather_data[i][chooseyear]){months_arr.push(i)}
}

for (month in months_arr){

  for(day in this.$root.$data.weather_data[months_arr[month]][chooseyear] ){
  x.push(day+' '+this.$root.$data.months_names[months_arr[month]-1]);
  x.push(day+' '+this.$root.$data.months_names[months_arr[month]-1]+'(н)');
  data_temp.push(this.$root.$data.weather_data[months_arr[month]][chooseyear][day].day_temp)
  data_temp.push(this.$root.$data.weather_data[months_arr[month]][chooseyear][day].day_night)
  }

}
  var y={
            label: 'Температура('+chooseyear+')',
            fill: false,
            backgroundColor: color,
            borderColor:color,
            pointRadius:1,
            data: data_temp
        }


      }else{
          var zzz=this.$root.$data.weather_data[this.$root.$data.month][chooseyear2]
var temperature_data=[];
let x=[];
var days;
var pointBackgroundColors=[];
days=0;
for(y in zzz){
temperature_data.push(zzz[y].day_temp)
temperature_data.push(zzz[y].day_night)
days+=1
}
console.log(days)
var xx=0;
  for (i=1;i<=days;i++){
    xx+=1;
    x.push(xx);
    xx+=1;
    x.push(xx);
    pointBackgroundColors.push(color);
    pointBackgroundColors.push('#0b73dc');
  }
  var y={label: 'Температура('+chooseyear2+')('+this.$root.$data.months_names_default[this.$root.$data.month-1]+')',
            fill: false,
            backgroundColor: color,
            borderColor:color,
            pointBackgroundColor:pointBackgroundColors,
            pointRadius:3,
            data: temperature_data }          



      }
        Vue.set(app.$children[app.$children.length-1].$children[el].chartData.datasets,app.$children[app.$children.length-1].$children[el].chartData.datasets.length, y);
        //app.$children[5].$children[el].chartData.datasets.push(y)
        this.reset(el)

  }


  }
}
const routes = [
{ path: '/set_weather', component: set_weather },
{ path: '/diary', component: Diary },
{ path: '/', component: Diary },
{ path: '/graphics', component: Graphics},
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

var app = new Vue({
  el:'#app',
  data:function () {
 return{
  weather_data:{
},
 data_month:{},
 months_names:["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],
 months_names_default:["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"],
 endyear:new Date().getFullYear(),
beginyear:new Date().getFullYear()-1,
  month:new Date().getMonth()+1,
  loading:true,
  last_year_in_db:null
  }  
},
methods: {
server_error:function(){
alert("ошибка")
},
fill_years(){
  let x=[];
  var year=this.endyear;
var data_temp=[];
var months_arr=[];
for (i=1;i<=12;i++){
   if(this.weather_data[i][year]){months_arr.push(i)}
}

for (month in months_arr){

  for(day in this.weather_data[months_arr[month]][year] ){
  x.push(day+' '+this.months_names[months_arr[month]-1]);
  x.push(day+' '+this.months_names[months_arr[month]-1]+'(н)');
  data_temp.push(this.weather_data[months_arr[month]][year][day].day_temp)
  data_temp.push(this.weather_data[months_arr[month]][year][day].day_night)
  }

}
  var datacollection = {
    labels: x,
    datasets: [{
            label: 'Температура('+year+')',
            fill: false,
            backgroundColor: '#f87979',
            borderColor:'#f87979',
            pointRadius:1,
            data: data_temp
        }
    ]
}
console.log(datacollection)
  return  datacollection
},
fill_month(){
  var zzz=app.weather_data[this.month][this.endyear]
var temperature_data=[];
let x=[];
var days;
var pointBackgroundColors=[];
days=Object.keys(zzz)[Object.keys(zzz).length-1];
console.log(1)
console.log(zzz)
for(var y=1;y<=days;y++){
  if(zzz[y]!==undefined){
temperature_data.push(zzz[y].day_temp)
temperature_data.push(zzz[y].day_night)
  }else{
temperature_data.push(0)
temperature_data.push(0)
  }
}
console.log(days)
var xx=0;
  for (i=1;i<=days;i++){
    xx+=1;
    x.push(xx);
    xx+=1;
    x.push(xx);
    pointBackgroundColors.push('#f87979');
    pointBackgroundColors.push('#0b73dc');
  }

  var datacollection = {
    labels: x,
    datasets: [{
            label: 'Температура('+this.endyear+')('+this.months_names_default[this.month-1]+')',
            fill: false,
            backgroundColor: '#f87979',
            borderColor:'#f87979',
            pointBackgroundColor:pointBackgroundColors,
            pointRadius:3,
            data: temperature_data
        }
    ]
}
console.log(datacollection)
//this.data_month=datacollection;
  return  datacollection
}
},
beforeCreate :function (){
  $.ajax({
            url: 'http://yourserverip:9080/get_data',
             error: function (jqXHR, exception) {
        },
      }).done(function(data) {
      	 this.weather_data=JSON.parse(data)
         console.log(data)
         this.last_year_in_db= parseInt(Object.keys(this.weather_data[1])[0])
         this.loading=false;
}.bind(this));
      },

router
});









