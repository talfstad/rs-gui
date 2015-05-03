<td style="width: 65px"><% if(ready) { %>  <small class="label pull-right bg-green">READY</small> <% } else { %> <small class="label pull-right bg-yellow">NOT READY</small> <% } %> </td>
<td style="width: 105px"><%= last_updated %></td>
<td>
  <span><%= user %></span>
  <button type="button" class="pull-right btn btn-default btn-xs" style="color: #333">
    <span class="fa fa-pencil-square-o" aria-hidden="true"></span> Edit Notes
  </button>
</td>
<td <% if(ready) { %> style="width: 160px" <% }else{ %> style="width: 65px" <% } %> >
  <a href="/download_original_lander?uuid=<%= uuid %>" type="button" class="btn btn-default btn-xs" style="color: #333">
    <span class="fa fa-download" aria-hidden="true"></span> Original
  </a>
  <% if(ready) { %>
    <a href="/download_installed_lander?uuid=<%= uuid %>" type="button" class="btn btn-default btn-xs" style="color: #333">
      <span class="fa fa-download" aria-hidden="true"></span> ClickJacker
    </a>
  <% } %>
</td>