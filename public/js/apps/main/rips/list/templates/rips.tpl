 <section class="content-header">
    <h1>Rips <small> &mdash; A list of all the Rips</small></h1>
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Rips</a></li>
    </ol>
</section>

<section class="content">
    <!-- Small boxes (Stat box) -->
    <div class="row">
        <section class="col-lg-12 connectedSortable">    


            <table id="rips-table" class="display dataTable" cellspacing="0" width="100%" role="grid" aria-describedby="example_info" style="width: 100%;">
                <thead>
                    <tr>
                        <th rowspan="1" colspan="1">Daily Hits</th><th rowspan="1" colspan="1">Redirect Rate</th><th rowspan="1" colspan="1">URL</th><th rowspan="1" colspan="1">Replacement Offer</th><th rowspan="1" colspan="1"></th>
                    </tr>
                </thead>

                <tfoot>
                    <tr>
                        <th rowspan="1" colspan="1">Daily Hits</th><th rowspan="1" colspan="1">Redirect Rate</th><th rowspan="1" colspan="1">URL</th><th rowspan="1" colspan="1">Replacement Offer</th><th rowspan="1" colspan="1"></th>
                    </tr>
                </tfoot>

                <tbody>
                    <% _.each(rips, function(row){ %>
                        <tr>
                            <td><%= row.daily_hits %></td>
                            <td><%= row.redirect_rate %>%</td>
                            <td><a href="<%= row.full_url %>"><%= row.url %></a></td>
                            <td><a href="<%= row.replacement_links %>"><%= row.replacement_links %></a></td>
                            <td>
                                <button type="button" class="btn btn-default btn-sm" style="color: #333">
                                  <span class="fa fa-pencil-square-o" aria-hidden="true"></span> Edit
                                </button>
                                <button type="button" class="btn btn-default btn-sm" style="color: #333">
                                  <span class="fa fa-bar-chart" aria-hidden="true"></span> Report
                                </button>
                            </td>
                        </tr>
                    <% }); %>
                </tbody>
            </table>
        </section>
    </div><!-- /.row -->



</section>

