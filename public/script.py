from PIL import Image

# Load the uploaded image
input_path = "./pingpox-home.com.png"
output_path = "./pingpox-home-transparent.png"

# Open the image
img = Image.open(input_path)

# Convert image to RGBA (adding an alpha channel)
img = img.convert("RGBA")

# Get data
data = img.getdata()

# Create new data with transparency where black (0, 0, 0) should be
new_data = []
for item in data:
    # Change all black (also shades of black)
    # pixels to transparent
    if item[0] == 0 and item[1] == 0 and item[2] == 0:
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append(item)

# Update image data
img.putdata(new_data)

# Save the image
img.save(output_path)

output_path
