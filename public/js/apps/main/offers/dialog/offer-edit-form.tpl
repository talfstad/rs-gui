<form class="form-horizontal">
  <div class="form-group">
    <label for="name" class="col-sm-3 control-label">Offer Name</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="name" name="name" value="<%= name %>">
    </div>
    <div class="col-sm-offset-3 col-sm-9">
      <p class="help-block">Edit the name of the offer.</p>
    </div>
  </div>

  <div class="form-group">
    <label for="offer_link" class="col-sm-3 control-label">Offer URL</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="offer_link" name="offer_link" value="<%= offer_link %>">
    </div>
    <div class="col-sm-offset-3 col-sm-9">
      <p class="help-block">This is the URL of the replacement offer.</p>
    </div>
  </div>

  <div class="form-group">
    <label for="website" class="col-sm-3 control-label">Admin URL</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="website" name="website" value="<%= website %>">
    </div>
    <div class="col-sm-offset-3 col-sm-9">
      <p class="help-block">Admin URL to check conversions, etc.</p>
    </div>
  </div>

  <div class="form-group">
    <label for="login" class="col-sm-3 control-label">Admin Username</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="login" name="login" value="<%= login %>">
    </div>
    <div class="col-sm-offset-3 col-sm-9">
      <p class="help-block">Username for Admin URL. Check with someone for the password.</p>
    </div>
  </div>  
</form>