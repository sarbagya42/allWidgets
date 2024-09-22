# Disk meter, minimal disk usage meter widget for Übersicht, made purely in svg
# and css, without external images.
# svg percentual circle from:
# https://medium.com/@pppped/how-to-code-a-responsive-circular-percentage-chart-with-svg-and-css-3632f8cd7705
# glow effect from: https://stackoverflow.com/users/1292848/paul-lebeau
#
# Reven Sanchez -- May 2020

# CONFIGURABLE STUFF
disk = "disk3s1"           # check 'df -hl' to figure out which disk you want
color = "green"          # The base color of the meter
warn_color = "#a500c2"     # Color used when disk is over 80% full
danger_color = "#f00"      # Color used when disk is over 90% full

# this is the shell command that gets executed every time this widget refreshes
command: """
df -hl | awk '/#{disk}/ {print $5; exit}' | sed s/'%'/''/
"""

# the refresh frequency in milliseconds
refreshFrequency: 30000

# render gets called after the shell command has executed. The command's output
# is passed in as a string. Whatever it returns will get rendered as HTML.
render: (output) -> """
<svg viewBox="0 0 56 56" width='130' height='150' id="meter">
  <circle class='back' cx="28" cy="28" r="15.9155" stroke-width="1"/>

  <path class="circle"
    stroke-dasharray="#{output}, 100"
    d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
    transform="translate(10,10)"
    filter="url(#red-glow)"
  />
  <defs>
      <filter id="red-glow" filterUnits="userSpaceOnUse"
              x="-50%" y="-50%" width="200%" height="200%">
         <!-- blur the path at different levels-->
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur10"/>
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur20"/>
        <!-- merge all the blurs except for the first one -->
        <feMerge result="blur-merged">
          <feMergeNode in="blur10"/>
          <feMergeNode in="blur20"/>
        </feMerge>
        <!-- recolour the merged blurs red-->
        <feColorMatrix result="red-blur" in="blur-merged" type="matrix"
                       values="1 0 0 0 0
                               0 0.06 0 0 0
                               0 0 0.44 0 0
                               0 0 0 1 0" />
        <feMerge>
          <feMergeNode in="red-blur"/>       <!-- largest blurs coloured red -->
          <feMergeNode in="blur5"/>          <!-- smallest blur left white -->
          <feMergeNode in="SourceGraphic"/>  <!-- original white text -->
        </feMerge>
      </filter>
    </defs>
</svg>
"""


# the CSS style for this widget, written using Stylus
# (http://learnboost.github.io/stylus/)
style: """
  border: none
  margin: 0
  padding: 0
  left:0%;
  top: 84%
  width: 1000
  height: 100px
  circle.back
    fill: transparent;
    stroke-width:5;
    stroke: #111;
  .circle
    stroke: #{color};
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
"""

update: (output, domEl) ->
  disk = output
  c = document.getElementsByTagName("path")[0]
  metercolor = color
  if disk > 80
    metercolor = warn_color
  if disk > 90
    metercolor = danger_color

  c.setAttribute("stroke-dasharray", disk + ", 100")
  c.style.stroke = metercolor
