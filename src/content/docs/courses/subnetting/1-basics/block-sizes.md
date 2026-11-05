---
title: "Block sizes and the magic number"
sidebar:
  order: 2
tags: [subnetting]
sample: true
---

Sample lesson. Subtract the interesting octet of the mask from 256 to get the block size:
  for 255.255.255.192 that is 256 - 192 = 64, so subnets start at .0, .64, .128 and .192.

<figure>
<svg class="fig" viewBox="0 0 560 200" role="img" aria-label="A /24 split into four /26 blocks">
<rect class="box a" x="20" y="30" width="520" height="40" rx="4"/><text x="34" y="55">192.168.10.0/24 · 256 addresses</text>
<rect class="box b" x="20" y="110" width="124" height="60" rx="4"/><text x="32" y="136">.0/26</text><text class="s" x="32" y="156">hosts .1-.62</text>
<rect class="box b" x="152" y="110" width="124" height="60" rx="4"/><text x="164" y="136">.64/26</text><text class="s" x="164" y="156">hosts .65-.126</text>
<rect class="box b" x="284" y="110" width="124" height="60" rx="4"/><text x="296" y="136">.128/26</text><text class="s" x="296" y="156">hosts .129-.190</text>
<rect class="box b" x="416" y="110" width="124" height="60" rx="4"/><text x="428" y="136">.192/26</text><text class="s" x="428" y="156">hosts .193-.254</text>
<path class="ln" d="M82 70V110M214 70V110M346 70V110M478 70V110"/>
</svg>
<figcaption><b>Figure 1.</b> A /24 split into four /26 blocks of 64 addresses.</figcaption>
</figure>
