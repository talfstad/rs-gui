 <section class="content-header">
    <h1>Earnings <small> &mdash; Overview and Management of the Money you're Making</small></h1>
    

    <div style="float: right;
  margin-top: 0px;
  font-size: 12px;
  padding: 7px 5px;
  position: absolute;
  top: 8px;
  right: 10px;
  border-radius: 2px;">
      <div id="earnings-daterange" style="font-size: 1.2em; background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc">
        <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
        <span></span> <b class="caret"></b>
      </div>
    </div>
    <ol class="breadcrumb" style="right: 230px">
        <li><a href="#"><i class="fa fa-diamond"></i> Select a Date Range: </a></li>
    </ol>
</section>

<section class="content">

    <!-- Small boxes (Stat box) -->
  <div class="row">
    <div id="earnings-stat-1" class="col-md-3 col-sm-6 col-xs-12"></div><!-- /.col -->

    <div id="earnings-stat-2" class="col-md-3 col-sm-6 col-xs-12"></div><!-- /.col -->

    <div id="earnings-stat-3" class="col-md-3 col-sm-6 col-xs-12"></div><!-- /.col -->

    <div id="earnings-stat-4" class="col-md-3 col-sm-6 col-xs-12"></div><!-- /.col -->
  </div><!-- /.row -->


  <div class="row">
    <!-- Left col -->
    <section class="col-xs-12 connectedSortable">                      
       <!-- Custom tabs (Charts with tabs)-->
        <div class="nav-tabs-custom">
            <!-- Tabs within a box -->
            <ul class="nav nav-tabs pull-right">
                <li class="active"><a href="#earnings-chart" data-toggle="tab">Overview of Earnings Graph</a></li> 
                <li class="pull-left header"><i class="fa fa-diamond"></i> Total Clicks and Conversions</li>
            </ul>
            <div id="earnings-graph" class="tab-content no-padding"></div>
        </div><!-- /.nav-tabs-custom -->
    </section>
  </div>


  <div class="row">
    <div class="col-xs-12">
      <div class="box box-primary">
        <div class="box-header with-border">
          <h3 class="box-title">List of your Earnings</h3>
        </div><!-- /.box-header -->
        <div class="box-body table-responsive">
          <div id="earnings-table-container" class="box-body">
            <table id="earnings-table"></table>
          </div><!-- /.box-body -->
        </div><!-- /.box -->
      </div>
    </div>
  </div>

</section>

