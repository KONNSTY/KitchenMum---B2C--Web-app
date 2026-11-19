#!/usr/bin/env bash
set -euo pipefail

backup_dir=/var/backups/kitchenmum
install -d -m 0700 "$backup_dir"
backup_path="$backup_dir/kitchenmum-$(date -u +%Y%m%dT%H%M%SZ).dump"
partial_path="${backup_path}.partial"
trap 'rm -f "$partial_path"' EXIT

docker exec kitchenmum-postgres pg_dump \
  --username=km_db_admin \
  --dbname=kitchenmum \
  --format=custom \
  --compress=6 > "$partial_path"

chmod 0600 "$partial_path"
mv "$partial_path" "$backup_path"
find "$backup_dir" -type f -name 'kitchenmum-*.dump' -mtime +13 -delete
