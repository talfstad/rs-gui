<td><%= daily_hits %></td>
<td><%= redirect_rate %></td>

<td><a target="_blank" href="<%= full_url %>"><%= url %></a></td>
<td><a target="_blank" href="<%= replacement_links %>"><%= offer_name %></a></td>
<td><%= daily_jacks %></td>
<td>
  <% if(admin) { %>
    <button type="button" class="btn btn-default btn-xs" style="color: #333">
      <span class="fa fa-pencil-square-o" aria-hidden="true"></span> Edit
    </button>
  <% } %>
    <!-- <a href="#myModal" data-backdrop="false" data-toggle="modal">Click Me</a> -->
    <button type="button" class="btn btn-default btn-xs" style="color: #333">
      <span class="fa fa-bar-chart" aria-hidden="true"></span> Report
    </button>
</td>