<template lang="pug">
  .widgets-page
    h1.page-title
      | Виджеты
      small &nbsp;для примера, пока нет данных
    b-row
      b-col(lg="3" md="6" xs="12")
        widget
          .clearfix
            b-row.flex-nowrap
              b-col(xs="3")
                span.widget-icon
                  i.fi.flaticon-like.text-primary
              b-col(xs="9")
                h6.m-0 USERS GROWTH
                p.h2.m-0.fw-normal 4,332
            b-row.flex-nowrap
              b-col(xs="6")
                h6.m-0 Registrations
                p.value5 +830
              b-col(xs="6")
                h6.m-0 Bounce Rate
                p.value5 4.5%
      b-col(lg="3" md="6" xs="12")
        widget
          .clearfix
            b-row.flex-nowrap
              b-col(xs="3")
                span.widget-icon
                  i.fi.flaticon-magic-wand.text-danger
              b-col(xs="9")
                .overflow-hidden
                  transition(name="carousel" mode="out-in")
                    div(v-if="carouselFirstGroup" key="first")
                      h6.m-0 VISITS TODAY
                      p.h2.m-0.fw-normal 12,324
                    div(v-else="" key="second")
                      h6.m-0 VISITS YESTERDAY
                      p.h2.m-0.fw-normal 11,885
            b-row.flex-nowrap
              b-col(xs="6")
                h6.m-0 New Visitors
                .overflow-hidden
                  transition(name="carousel" mode="out-in")
                    p.value5(v-bind:key="carouselFirstGroup")
                      | {{carouselFirstGroup ? '1,332' : '20.1%'}}
              b-col(xs="6")
                h6.m-0 Bounce Rate
                .overflow-hidden
                  transition(name="carousel" mode="out-in")
                    p.value5(v-bind:key="carouselFirstGroup")
                      | {{carouselFirstGroup ? '217' : '2.3%'}}
      b-col(lg="3" md="6" xs="12")
        widget
          .overflow-hidden
            transition(name="carousel" mode="out-in")
              div(v-if="carouselFirstGroup" key="first")
                b-row.flex-nowrap
                  b-col(xs="3")
                    span.widget-icon
                      i.fi.flaticon-notebook-4.text-info
                  b-col(xs="9")
                    h6.m-0 ORDERS
                    p.h2.m-0.fw-normal 82,765
                b-row.flex-nowrap
                  b-col(xs="6")
                    h6.m-0 Avg. Time
                    p.value5 2:56
                  b-col(xs="6")
                    h6.m-0 Last Week
                    p.value5 374
              div(v-else="" key="second")
                b-row.flex-nowrap
                  b-col(xs="3")
                    span.widget-icon
                      i.fi.flaticon-shuffle.text-info
                  b-col(xs="9")
                    h6.m-0 PICKED ORDERS
                    p.h2.m-0.fw-normal 13.8%
                b-row.flex-nowrap
                  b-col(xs="6")
                    h6.m-0 Basic
                    p.value5 3,692
                  b-col(xs="6")
                    h6.m-0 Advanced
                    p.value5 1,441
      b-col(lg="3" md="6" xs="12")
        widget
          .clearfix
            b-row.flex-nowrap
              b-col(xs="3")
                span.widget-icon
                  i.fi.flaticon-diamond.text-success
              b-col(xs="9")
                h6.m-0 TOTAL PROFIT
                p.h2.m-0.fw-normal $7,448
            b-row.flex-nowrap
              b-col(xs="6")
                h6.m-0 Last Month
                p.value5 $83,541
              b-col(xs="6")
                h6.m-0 Last Week
                p.value5 $17,926
    FlotCharts
</template>

<script>
import Skycon from '@/components/Skycon/Skycon';
import Widget from '@/components/Widget/Widget';
import FlotCharts from './components/flot-charts/FlotCharts';
import Nasdaq from './components/nasdaq/Nasdaq';
import YearsMap from './components/years-map/YearsMap';
import RealtimeTraffic from './components/realtime-traffic/RealtimeTraffic';
import ChangesChart from './components/changes-chart/ChangesChart';

export default {
  name: 'Widgets',
  components: {
    Widget,
    FlotCharts,
    Skycon,
    Nasdaq,
    YearsMap,
    RealtimeTraffic,
    ChangesChart,
  },
  data() {
    return {
      carouselFirstGroup: true,
      flipFirstGroup: true,
      animationInterval: null
    }
  },
  mounted() {
    this.animationInterval = setInterval(() => {
      this.slideWidget();
      this.flipWidget();
    }, 1000 * 4);
  },
  methods: {
    flipWidget() {
      this.flipFirstGroup = !this.flipFirstGroup
    },
    slideWidget() {
      this.carouselFirstGroup = !this.carouselFirstGroup
    },
  },
  beforeDestroy() {
    clearInterval(this.animationInterval);
  }
};
</script>

<style src="./Widgets.scss" lang="scss" />
