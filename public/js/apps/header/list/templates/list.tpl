


            <!-- Logo -->
        <a href="index2.html" class="logo"><img src="../img/cjlogo.png" alt="Clickjacker Home" /></a>
        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top" role="navigation">
          <!-- Sidebar toggle button-->
          <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
            <span class="sr-only">Toggle navigation</span>
          </a>
          <!-- Navbar Right Menu -->
          <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
           
              <!-- User Account: style can be found in dropdown.less -->
              <% if(logged_in == true){ %>
                <div class="navbar-right">
                    <ul class="nav navbar-nav">
                        <li class="dropdown user user-menu">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                                <i class="glyphicon glyphicon-user"></i>
                                <span>Buildcave, LLC<i class="caret"></i></span>
                            </a>
                            <ul class="dropdown-menu">
                                <!-- User image -->
                                <li class="user-header bg-light-black">
                                    <img src="../img/trackerjacker.png" class="img-circle" alt="User Image">
                                    <p>
                                        Buildcave ClickJacker <!-- ™ -->
                                        <small>Getting Clicks since Jan 2015</small>
                                    </p>
                                </li>
                                <!-- Menu Footer-->
                                <li class="user-footer">
                                    <div class="pull-right">
                                        <a id="logout-link" class="btn btn-default btn-flat" href="#" data-bypass>Sign Out</a>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
        <% } %>
            </ul>
          </div>
        </nav>