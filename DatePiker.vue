<template>
    <div class="date-picker" v-click-outside>
        <div class="picker-input">
            <span class="input-prefix">
                <i class="iconfont icon-date"></i>
            </span>
            <input type="text"
                :value="chooseDate"
            >
        </div>
        <div class="picker-panel" v-show="panelShow">
            <div class="picker-arrow"></div>
            <div class="picker-body">
                <div class="picker-header">
                    <span class="prev-year iconfont"
                            @click="changeYear(-1)"
                    ></span>
                    <span class="prev-month iconfont"
                            @click="changeMonth(-1)"
                    ></span>
                    <span class="picker-date">{{renderShowDate}}</span>
                    <span class="next-month iconfont"
                            @click="changeMonth(1)"
                    ></span>
                    <span class="next-year iconfont"
                            @click="changeYear(1)"
                    ></span>
                </div>
                <div class="picker-content">
                    <div class="picker-weeks"
                    >
                    <div class="week"
                         v-for="week in ['日','一','二','三','四','五','六']"
                        :key="week"
                    >{{ week }}</div>
                    </div>
                    <div class="picker-days">
                        <div v-for="date in getPageStart"
                            :key="date.getTime()"
                            :class="{
                                isThisMonth:isCur(date).month,
                                isToday:isCur(date).day,
                                isSelected:isSelected(date)
                            }"
                            @click="handleClick(date)"
                        >
                        {{ date.getDate() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        date:{
            type:Date
        }
    },
    directives: {
      "click-outside":{
          bind(el,binding,VNode){
              document.onclick = function (e) {
                  const vm = VNode.context;
                  const dom = e.target;
                  const isSon = el.contains(dom);
                  if(isSon&&!vm.panelShow){
                      vm.changePanel(true);
                  }
                  else if(!isSon&&vm.panelShow){
                      vm.changePanel(false);
                  }
              }
          }
      }  
    },
    data () {
        return {
            panelShow:false,
            showDate:{
                year:0,
                month:0,
                day:0
            },
            selectDate:new Date()
        }
    },
    created () {
        this.getShowDate();
    },
    computed: {
        chooseDate(){
            const {year,month,day} = this.showDate;
            return `${year}-${month+1}-${day}`
        },
        renderShowDate(){
            return `${this.showDate.year}年${this.showDate.month+1}月`
        },
        getPageStart(){
            const {year,month} = this.showDate;
            const firstDate  = new Date(year,month,1);
            const week = firstDate.getDay()
            const resultTime = +firstDate-week*24*60*60*1000;
            let resultDate;
            var dayArr = [];
            for(let i = 0; i < 42; i++){
                resultDate = new Date(resultTime+i*24*60*60*1000);
                dayArr.push(resultDate);
            }
            return dayArr;
        }
    },
    methods: {
        getDate(date){
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            return{
                year,
                month,
                day
            }
        },
        getShowDate(){
            this.showDate.year = this.date.getFullYear();
            this.showDate.month = this.date.getMonth();
            this.showDate.day = this.date.getDate();
        },
        changePanel(flag){
            this.panelShow = flag;
        },
        isCur(date){
            const {year:thisYear,month:thisMonth,day:thisDay} = this.getDate(this.date)
            const {year:showYear,month:showMonth} = this.showDate;
            const {year,month,day} = this.getDate(date);
            return {
                month:year == showYear && month == showMonth,
                day:year == thisYear && month == thisMonth && thisDay == day
            }
        },
        isSelected(date){
            const {year:showYear,month:showMonth,day:showDay} = this.getDate(this.selectDate);
            const {year,month,day} = this.getDate(date);
            return year == showYear && month == showMonth && day == showDay
        },
        handleClick(date){
            this.selectDate = date;
            const {year,month,day} = this.getDate(date);
            this.showDate.year = year;
            this.showDate.month = month;
            this.showDate.day = day;
        },
        changeYear(flag){
            this.showDate.year += flag;
        },
        changeMonth(flag){
            this.showDate.month += flag;
            if(this.showDate.month>=12){
                this.showDate.year ++;
                this.showDate.month = 0;
            }
            if(this.showDate.month<0){
                this.showDate.year--;
                this.showDate.month = 11
            }
        }
        
    }
}
</script>
<style scoped>
    @font-face {
  font-family: 'iconfont';  /* project id 2274915 */
  src: url('//at.alicdn.com/t/font_2274915_cqlz003234b.eot');
  src: url('//at.alicdn.com/t/font_2274915_cqlz003234b.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_2274915_cqlz003234b.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_2274915_cqlz003234b.woff') format('woff'),
  url('//at.alicdn.com/t/font_2274915_cqlz003234b.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_2274915_cqlz003234b.svg#iconfont') format('svg');
}
.iconfont{
    font-family: "iconfont";
    font-style: normal;
}
.icon-date::before{
    content: '\e647';
}
.prev-year::before{
    content: '\e600';
}
.prev-month::before{
    content: '\e62a';
}
.next-year::before{
    content: '\e61e';
}
.next-month::before{
    content: '\e6fd';
}
.date-picker{
    display: inline-block;
}
.picker-input{
    border: 1px solid black;
    position: relative;
    width: 200px;
    height: 30px;
    padding-left: 30px;
}
.input-prefix{
    position: absolute;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    left: 0;
    color: #777;
    border-right: 1px solid black;
}
.picker-input input{
    height: 100%;
    border: none;
    outline: none;
    padding: 0;
    width: 200px;
    text-indent: 4px;
}
.picker-panel{
    position: absolute;
    width: 322px;
    height: 329px;
    margin-top: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.5);
    background-color: #fff;
    border: 1px solid #ccc;
}
.picker-arrow{
    width: 0;
    height: 0;
    border-width:6px ;
    border-style: solid;
    position: absolute;
    top: -12px;
    left: 24px;
    border-color: transparent transparent #ccc transparent; 
}
.picker-arrow:after{
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-width:6px ;
    border-style: solid;
    position: absolute;
    border-top-width: 0px;
    border-color: transparent transparent #fff transparent;
    left: -6px;
    top: 1px; 
}
.picker-header{
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5px;
    justify-content: center;
}
.picker-date{
    margin:0 35px
}
.prev-month,
.next-month{
    margin: 0 15px;
}
.picker-weeks{
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin:5px 0
}
.picker-days{
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}
.picker-days div{
    width: 35px;
    height: 35px;
    margin: 5px;
    color: rgb(172, 164, 164);
    line-height: 35px;
    text-align: center;
}
.picker-days .isThisMonth{
    color: black;
}
.picker-days .isToday{
    color: rgb(68, 137, 228);
}
.picker-days .isSelected{
    background-color: rgb(68, 137, 228);
    color: #fff;
    border-radius: 50%;
}
</style>