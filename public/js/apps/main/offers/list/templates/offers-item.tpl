<td><%= name %></td>
<td><a target="_blank" href="<%= offer_link %>"> <%= offer_link %> </a></td>
<td><%= external_id %></td>
<td><% if(admin) { %><a target="_blank" href="<%= website %>"> <%= website %> </a>  <% } %> </td>
<td><% if(admin) { %> <%= login %> <% } %></td>
<td> <%= username %> </td>
<td>
  <% if(admin) { %> 
    <button type="button" class="btn btn-default btn-xs offer-edit" style="color: #333">
      <span class="fa fa-pencil-square-o" aria-hidden="true"></span> Edit
    </button>
    <button type="button" class="btn btn-default btn-xs offer-delete" style="color: #333">
      <span class="fa fa-remove" aria-hidden="true"></span> Delete
    </button>
  <% } %>
</td>
