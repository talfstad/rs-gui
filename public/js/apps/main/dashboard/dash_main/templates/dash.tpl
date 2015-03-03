 <section class="content-header">
                    <h1>
                        Overview
                        <small> &mdash; Daily Stats</small>
                    </h1>
                    <ol class="breadcrumb">
                        <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
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
                                    <%= overViewStatsModel.total_rips %> Total Rips
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
                                        $240.00
                                    </h3>
                                    <p>
                                        Earned Today
                                    </p>
                                </div>
                                <div class="icon">
                                    <i class="ion ion-earth"></i>
                                </div>
                                <a href="#" class="small-box-footer">
                                    <span style="color: rgba(255, 255, 255, 0.0)">.</span>
                                </a>
                            </div>
                        </div><!-- ./col -->
                    </div><!-- /.row -->

                  </section>