 <section class="content-header">
                    <h1>
                        Daily Overview
                        <small> &mdash; Daily Stats</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="#"><i class="fa fa-dashboard"></i> Overview</a></li>
                    </ol>
                </section>

<section class="content">
                    <!-- Small boxes (Stat box) -->
                    <div class="row">
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                          <span class="info-box-icon bg-aqua"><i class="ion ion-stats-bars"></i></span>
                          <div class="info-box-content">
                            <span class="info-box-text">Ripped Hits Today</span>
                            <span class="info-box-number"><%= overViewStatsModel.total_daily_ripped_hits %></span>
                          </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                      </div><!-- /.col -->
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                          <span class="info-box-icon bg-yellow"><i class="ion ion-social-usd"></i></span>
                          <div class="info-box-content">
                            <span class="info-box-text">Replacement Offers Shown</span>
                            <span class="info-box-number"><%= overViewStatsModel.total_daily_jacks %></span>
                          </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                      </div><!-- /.col -->
                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                          <span class="info-box-icon bg-red"><i class="ion ion-person-add"></i></span>
                          <div class="info-box-content">
                            <span class="info-box-text">Rips Today</span>
                            <span class="info-box-number"><%= overViewStatsModel.total_daily_rips %></span>
                          </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                      </div><!-- /.col -->

                      <!-- fix for small devices only -->
                      <div class="clearfix visible-sm-block"></div>

                      <div class="col-md-3 col-sm-6 col-xs-12">
                        <div class="info-box">
                          <span class="info-box-icon bg-green"><i class="ion ion-pie-graph"></i></span>
                          <div class="info-box-content">
                            <span class="info-box-text">Registered User Hits Today</span>
                            <span class="info-box-number"><%= overViewStatsModel.total_daily_registered_hits %></span>
                          </div><!-- /.info-box-content -->
                        </div><!-- /.info-box -->
                      </div><!-- /.col -->
                      
                    </div><!-- /.row -->


                    <div class="row">
                        <!-- Left col -->
                        <section class="col-lg-12 connectedSortable">                            


                            <!-- Custom tabs (Charts with tabs)-->
                            <div class="nav-tabs-custom">
                                <!-- Tabs within a box -->
                                <ul class="nav nav-tabs pull-right">
                                    <li class="active"><a href="#ripped-hits-chart" data-toggle="tab">Ripped Hits</a></li> 
                                    <li class="pull-left header"><i class="fa fa-inbox"></i> Total Ripped Hits for the last Month</li>
                                </ul>
                                <div class="tab-content no-padding">
                                    <!-- Morris chart - Sales -->
                                    <div class="chart tab-pane active" id="ripped-hits-chart" style="position: relative; height: 300px;"></div>
                                </div>
                            </div><!-- /.nav-tabs-custom -->
                        </section>
                    </div>
                  </section>

