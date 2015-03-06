<div class="rip-edit-container">


  <form>
    <div class="control-group">
      <label for="replacement-links" class="control-label">Replacement Offer:</label>
      <input id="replacement-links" name="replacement_links" type="text" value="<%= replacement_links %>" placeholder="<%= replacement_links %>"/>
    </div>
    
    <div class="control-group">
      <label for="redirect-rate" class="control-label">Redirect Rate (0-100):</label>
      <input id="redirect-rate" name="redirect_rate" type="text" value="<%= redirect_rate %>" placeholder="<%= redirect_rate %>"/>%
    </div>
  
  <!--   <div class="input-group input-group-md">
    <input type="text" class="form-control" placeholder="<%= redirect_rate %>" aria-describedby="sizing-addon1">

    <span class="input-group-addon" id="sizing-addon1">%</span>
  </div>  -->
    
    <button class="btn js-submit">Update Rip</button>

  </form>


</div>