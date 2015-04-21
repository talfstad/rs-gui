<td><%= daily_hits %></td>
<td><%= redirect_rate %></td>

<td><a target="_blank" href="<%= full_url %>"><%= url %></a></td>
<td><a target="_blank" href="<%= replacement_links %>"><%= offer_name %></a></td>
<td><%= daily_jacks %></td>

<!-- List top 3 countries and give more > if there are more -->
<td>
<% _.each(topFlags, function(flag) { %>
    <img class="flag-tooltip rips-grid-flag" src="/images/flags/<%= flag.url %>" alt="<%= flag.hits %> Daily Hit<% if(flag.hits > 1){ %>s<% } %> in <%= flag.name %>" title="<%= flag.hits %> Daily Hit<% if(flag.hits > 1){ %>s<% } %> in <%= flag.name %>"/>
<% }) %>
</td>
<td>
  <% if(admin) { %>
    <button type="button" class="rip-edit btn btn-default btn-xs" style="color: #333">
      <span class="fa fa-pencil-square-o" aria-hidden="true"></span> Edit
    </button>
  <% } %>
     <button type="button" class="rip-report btn btn-default btn-xs" style="color: #333">
      <span class="fa fa-bar-chart" aria-hidden="true"></span> Report
    </button>
</td>