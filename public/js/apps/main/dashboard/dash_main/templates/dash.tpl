 <section class="content-header">
                    <h1>
                        Overview
                        <small> &mdash; Daily Stats</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="#"><i class="fa fa-dashboard"></i> Overview</a></li>
                    </ol>
                </section>

<section class="content">
                    <!-- Small boxes (Stat box) -->
                    <div class="row">
                        <div class="col-lg-3 col-xs-6">
                            <!-- small box -->
                            <div class="small-box bg-aqua">
                                <div class="inner">
                                    <h3>
                                        <%= overViewStatsModel.total_daily_ripped_hits %>
                                    </h3>
                                    <p>
                                        Ripped Hits Today
                                    </p>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-stats-bars"></i>
                                </div>
                                <a href="#" class="small-box-footer">
                                    <%= overViewStatsModel.total_ripped_hits %> Total Ripped Hits
                                </a>
                            </div>
                        </div><!-- ./col -->
                        <div class="col-lg-3 col-xs-6">
                            <!-- small box -->
                            <div class="small-box bg-green">
                                <div class="inner">
                                    <h3>
                                        <%= overViewStatsModel.total_daily_rips %>
                                    </h3>
                                    <p>
                                        Rips Today
                                    </p>
                                </div>
                                <div class="icon">
                                   <i class="ion ion-person-add"></i>
                                </div>
                                <a href="#" class="small-box-footer">
                                    <%= overViewStatsModel.total_rips_100 %> Total Rips with 100+ Hits
                                </a>
                            </div>
                        </div><!-- ./col -->
                        
                        <div class="col-lg-3 col-xs-6">
                            <!-- small box -->
                            <div class="small-box bg-red">
                                <div class="inner">
                                    <h3>
                                        <%= overViewStatsModel.total_daily_registered_hits %>
                                    </h3>
                                    <p>
                                        Registered User Hits Today
                                    </p>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-pie-graph"></i>
                                </div>
                                <a href="#" class="small-box-footer">
                                    <%= overViewStatsModel.total_registered_hits %> Total Registered User Hits
                                </a>
                            </div>
                        </div><!-- ./col -->
                        <div class="col-lg-3 col-xs-6">
                            <!-- small box -->
                            <div class="small-box bg-yellow">
                                <div class="inner">
                                    <h3>
                                        $0
                                    </h3>
                                    <p>
                                        Money Earned Today
                                    </p>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-social-usd"></i>
                                </div>
                                <a href="#" class="small-box-footer">
                                    <span style="color: rgba(255, 255, 255, 0.0)">.</span>
                                </a>
                            </div>
                        </div><!-- ./col -->
                    </div><!-- /.row -->


                    <div class="row">
                        <!-- Left col -->
                        <section class="col-lg-12 connectedSortable">                            


                            <!-- Custom tabs (Charts with tabs)-->
                            <div class="nav-tabs-custom">
                                <!-- Tabs within a box -->
                                <ul class="nav nav-tabs pull-right">
                                    <li class="active"><a href="#ripped-hits-chart" data-toggle="tab">Ripped Hits</a></li> 
                                    <li class="pull-left header"><i class="fa fa-inbox"></i> Total Ripped Hits for the last 20 days</li>
                                </ul>
                                <div class="tab-content no-padding">
                                    <!-- Morris chart - Sales -->
                                    <div class="chart tab-pane active" id="ripped-hits-chart" style="position: relative; height: 300px;"></div>
                                </div>
                            </div><!-- /.nav-tabs-custom -->
                        </section>
                    </div>
                  </section>

