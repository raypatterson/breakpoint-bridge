# https://gist.github.com/urre/4060461
module Sass::Script::Functions
  def getRandomColor()
    Sass::Script::String.new("#%06x" % (rand * 0xffffff))
  end
end

preferred_syntax = :scss
sass_dir = 'demo'
css_dir = 'demo'