ffmpeg -i src/logo512.svg \
  -vf "scale=512:512:force_original_aspect_ratio=decrease" \
  -frames:v 1 \
  -pix_fmt rgba \
  public/logo512.png

ffmpeg -i src/logo192.svg \
  -vf "scale=192:192:force_original_aspect_ratio=decrease" \
  -frames:v 1 \
  -pix_fmt rgba \
  public/logo192y.png