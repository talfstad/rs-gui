<% if(children) { %>

  <a href="#">
    <i class="<%= icon %>"></i>
    <span><%= name %></span>
    <i class="fa fa-angle-left pull-right"></i>
  </a>
  <ul class="treeview-menu">
    <% _.each(children, function(child, child_name) { %>
      <li style="margin-left: 10px;"><a href="#" data-link="<%= child_name %>"><i class="<%= child.icon %>"></i> <%= child.name %></a></li>
    <% }) %>
  </ul>
            
  

<% } else { %>

  <a class="leftnav-link">
      <i class="<%= icon %>"></i> <span> <%= name %> </span>
  </a>

<% } %>

    