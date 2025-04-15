import json
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

# Input and output file paths
input_geojson_path = "./public/data/ca_counties_simplified.geojson"
output_geojson_path = "./public/data/ca_counties_normalized.geojson"

def normalize_geojson(input_path, output_path):
    # Load the GeoJSON file
    with open(input_path, "r") as f:
        geojson_data = json.load(f)

    # Process each feature
    for feature in geojson_data["features"]:
        geometry = shape(feature["geometry"])

        # If the geometry is a MultiPolygon, collapse it into a single Polygon if possible
        if geometry.geom_type == "MultiPolygon":
            geometry = unary_union(geometry)

        # Convert back to GeoJSON format
        feature["geometry"] = mapping(geometry)

    # Save the normalized GeoJSON
    with open(output_path, "w") as f:
        json.dump(geojson_data, f, indent=2)

    print(f"Normalized GeoJSON saved to {output_path}")

# Run the normalization
normalize_geojson(input_geojson_path, output_geojson_path)