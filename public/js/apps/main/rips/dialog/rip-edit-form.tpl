<form role="form" class="form-horizontal">

  <div class="form-group" style="position: relative; bottom: 16px">
    <div class="bg-info col-sm-12" style="text-align: center; padding: 10px 0 10px">
        <span>This Rip is owned by: <strong><%= model.username %></strong>. </span>
    </div>
  </div>

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
      <p class="help-block">Please select a replacement offer. All offers in this list are owned by <br> <%= model.username %>.</p>
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

<hr>

  <div class="form-group">
    <label class="col-xs-3 control-label">Register Domain</label>
    <div class="checkbox checkbox-danger col-xs-1" style="margin-left: 15px">
      <div class="input-group">
        <input type="checkbox" id="register">
        <label for="register">
        </label>
      </div>
    </div>
    <div class="col-xs-7">
      <p id="register-help" class="help-block">Register this domain <strong>ONLY</strong> if you own it. Once registered, any URLs on this domain will not be jacked from.</p>
    </div>
  </div> 
</form>