<td><%= date_created %></td>
<td><a target="_blank" href="<%= url %>"> <%= url %> </a></td>
<td><%= numbersWithCommas(hits) %></td>
<td>
  <button type="button" class="unregister btn btn-default btn-xs offer-delete" style="color: #333">
      <span class="fa fa-remove" aria-hidden="true"></span> Unregister
    </button>
</td>