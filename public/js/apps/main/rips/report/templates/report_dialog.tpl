
  <div class="row">
      <section class="col-lg-12 connectedSortable">

        <div class="nav-tabs-custom">
            <ul class="nav nav-tabs pull-right">
                <li class="active"><a id="report-last-month" href="#report-hits-jacks-graph" data-toggle="tab">For the Last Month</a></li>
                <li><a id="report-by-the-hour" href="#rip-report-hourly-chart" data-toggle="tab">Today By The Hour</a></li>
                <li class="pull-left header"><i class="fa fa-line-chart"></i> Total Ripped Hits &amp; Jacks</li>
            </ul>
            <div class="tab-content no-padding">
                <div class="chart tab-pane active" id="report-hits-jacks-graph" style="position: relative; height: 300px;"></div>
                <div class="chart tab-pane" id="rip-report-hourly-chart" style="width: 100%; position: relative; height: 300px;"></div>
            </div>
        </div>

    
      </section>

      <section class="col-lg-12">
        <h4 class="pull-left header"><i class="fa fa-map-marker"></i> Currently Running in <%= countries.length %> Countries</h4>
            
        <div id="world-map-countries-container">     
        </div>

      </section>


