#!/bin/bash

# Wait for MinIO to be ready
until /usr/bin/mc ready local; do
    sleep 1
done

# Configure MinIO client
/usr/bin/mc alias set local http://localhost:9000 minioadmin minioadmin

# Create default buckets
/usr/bin/mc mb local/assets
/usr/bin/mc mb local/updates
/usr/bin/mc mb local/avatars

# Set bucket policies (optional - set to public read for assets)
/usr/bin/mc policy set download local/assets 