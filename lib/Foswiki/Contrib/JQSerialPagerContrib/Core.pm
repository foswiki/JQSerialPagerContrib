# Plugin for Foswiki - The Free and Open Source Wiki, http://foswiki.org/
#
# JQSerialPagerContrib is Copyright (C) 2012-2025 Michael Daum http://michaeldaumconsulting.com
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details, published at
# http://www.gnu.org/copyleft/gpl.html

package Foswiki::Contrib::JQSerialPagerContrib::Core;

use strict;
use warnings;

use Foswiki::Contrib::JQSerialPagerContrib ();
use Foswiki::Plugins::JQueryPlugin::Plugin ();
our @ISA = qw( Foswiki::Plugins::JQueryPlugin::Plugin );

sub new {
  my $class = shift;

  my $this = bless(
    $class->SUPER::new(
      name => 'SerialPager',
      version => $Foswiki::Contrib::JQSerialPagerContrib::VERSION,
      author => 'Michael Daum',
      homepage => 'http://foswiki.org/Extensions/JQSerialPagerContrib',
      documentation => 'JQSerialPagerContrib',
      css => ['jquery.serialpager.css'],
      javascript => ['jquery.serialpager.js'],
      puburl => '%PUBURLPATH%/%SYSTEMWEB%/JQSerialPagerContrib',
      i18n => $Foswiki::cfg{SystemWebName} . "/JQSerialPagerContrib/i18n",
      dependencies => ['serialscroll', 'i18n'],
    ),
    $class
  );

  return $this;
}

1;
