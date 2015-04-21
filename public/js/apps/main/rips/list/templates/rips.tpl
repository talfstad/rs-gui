 <section class="content-header">
    <h1>Rips <small> &mdash; Overview and Management of the Rips</small></h1>
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-line-chart"></i> Rips</a></li>
    </ol>
</section>

<section class="content">
  <div class="row">
      <!-- Left col -->
      <section class="col-lg-7 connectedSortable">                            
         <!-- Custom tabs (Charts with tabs)-->
          <div class="nav-tabs-custom">
              <!-- Tabs within a box -->
              <ul class="nav nav-tabs pull-right">
                  <li class="active"><a href="#rips-chart" data-toggle="tab">Rips</a></li> 
                  <li class="pull-left header"><i class="fa fa-line-chart"></i> Total Rips for the last Month</li>
              </ul>
              <div id="rips-stats-graph" class="tab-content no-padding"></div>
          </div><!-- /.nav-tabs-custom -->
      </section>

      <section class="col-lg-5 connectedSortable ui-sortable">

              <!-- Map box -->
              <div class="box box-solid">
                <div class="box-header ui-sortable-handle bg-light-blue-gradient">
                  <!-- tools box -->
                 <!-- <div class="pull-right box-tools">
                    <button class="btn btn-primary btn-sm daterange pull-right" data-toggle="tooltip" title="" data-original-title="Date range"><i class="fa fa-angle-down"></i></button>
                  </div> /. tools -->

                  <i class="fa fa-map-marker"></i>
                  <h3 class="box-title">
                    New Rips Today
                  </h3>
                </div>
                <div class="box-footer no-border">
                  
                  <div class="row">
                    <div class="col-xs-12">
                      <!-- <div class="box"> -->
                        <div class="box-body table-responsive">
                          <div id="new-rips-table-container" class="box-body">
                            <table id="new-rips-table"></table>
                          </div><!-- /.box-body -->
                        </div><!-- /.box -->
                      <!-- </div> -->
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-xs-6 text-center" style="border-right: 1px solid #f4f4f4">
                      <div>
                        <h3 style="margin-top: 0;">0</h3>
                      </div>
                       
                      <div class="knob-label">Total Rips Today</div>
                    </div><!-- ./col -->
                   <!--  <div class="col-xs-6 text-center" style="border-right: 1px solid #f4f4f4">
                      <h3>5</h3>
                      <div class="knob-label">New Domains</div>
                    </div> --><!-- ./col -->
                    <div class="col-xs-4 text-center">
                       <h3 style="margin-top: 0;">0</h3>
                      <div class="knob-label">New Domains</div>
                    </div><!-- ./col -->
                  </div><!-- /.row -->
                </div>
              </div>
              <!-- /.box -->

             

            </section>


    </div>

  <div class="row">
    <div class="col-xs-12">
      <div class="box">
        <div class="box-header">
          <h3 class="box-title">Edit Rip Replacement Offers and Offer Redirect Rates</h3>
        </div><!-- /.box-header -->
        <div class="box-body table-responsive">
          <div id="rips-table-container" class="box-body">
            <table id="rips-table"></table>
          </div><!-- /.box-body -->
        </div><!-- /.box -->
      </div>
    </div>
  </div>
</section>

<div id="dialog-region"></div>

