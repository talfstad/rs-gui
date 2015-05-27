<td style="width: 65px">
  <%  if(ready === 0) { %>  <small class="label pull-right bg-red">NOT READY</small> <% } 
      if(ready === 1) { %>  <small class="label pull-right bg-yellow">INSTALLED</small> <% } 
      if(ready === 2) { %>  <small class="label pull-right bg-green">ACTIVE</small> <% } %> 
</td>
<td style="width: 105px"><%= last_updated %></td>
<td>
  <span>User: <% if(admin) { %> <%= user %> <% } %> | <%= notes %></span>
  <button type="button" class="notes pull-right btn btn-default btn-xs" style="color: #333">
    <span class="fa fa-pencil-square-o" aria-hidden="true"></span> Edit Notes
  </button>
</td>
<td <% if(ready) { %> style="width: 160px" <% }else{ %> style="width: 65px" <% } %> >
  <a href="<%= original_url %>" type="button" class="btn btn-default btn-xs" style="color: #333">
    <span class="fa fa-download" aria-hidden="true"></span> Original
  </a>
  <% if(ready) { %>
    <a href="<%= installed_url %>" type="button" class="btn btn-default btn-xs" style="color: #333">
      <span class="fa fa-download" aria-hidden="true"></span> ClickJacker
    </a>
  <% } %>
</td>
