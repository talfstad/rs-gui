<form>

  <div class="control-group">
    <label for="contact-firstName" class="control-label">Replacement Offer:</label>
    <input id="contact-firstName" name="firstName" type="text" value="<%= replacement_links %>"/>
  </div>
  
  <div class="control-group">
    <label for="contact-lastName" class="control-label">Redirect Rate (0-100):</label>
    <input id="contact-lastName" name="lastName" type="text" value=""/>%
  </div>
<!-- 
  <div class="input-group input-group-md">
  <input type="text" class="form-control" placeholder="<%= redirect_rate %>" aria-describedby="sizing-addon1">

  <span class="input-group-addon" id="sizing-addon1">%</span>
</div> -->
  
  <button class="btn js-submit">Update Rip</button>

</form>