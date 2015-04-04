<form class="form-horizontal">
  <div class="form-group">
    <label for="offer_id" class="col-sm-3 control-label">Offer</label>
    <div class="col-sm-9">
      <!-- <input type="text" class="form-control" id="replacement_links" name="model.replacement_links" value="<%= model.replacement_links %>"> -->
       <select name="offer_id" class="offer-select" data-size="5" data-width="auto" data-live-search="true">
        <% _.each(offerList, function(offer){ %>
          <option value="<%= offer.id %>"><%= offer.name %></option>
        <% }); %>
      </select>
    </div>
    <div class="col-sm-offset-3 col-sm-9">
      <p class="help-block">Please enter your replacement offer link.</p>
    </div>
  </div>
  <div class="form-group">
    <label for="redirect_rate" class="col-sm-3 control-label">Redirect Rate</label>
    <div class="col-sm-4">
      <div class="input-group">
        <input type="text" class="form-control" id="redirect_rate" name="redirect_rate" value="<%= model.redirect_rate %>">
        <div class="input-group-addon">%</div>
      </div>
    </div>
    <div class="col-sm-offset-3 col-sm-9">
      <p class="help-block">This is the % of ripped traffic that will redirect to your offer.</p>
    </div>

  </div>
  
</form>