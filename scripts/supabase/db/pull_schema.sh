#!/bin/zsh

# Get project id from environment variable or first arg
project_id=${SUPABASE_PROJECT_ID:-$1}

if [ -z "$project_id" ]; then
  echo 'Supabase project ID is not set. Either set SUPABASE_PROJECT_ID or run ./pull_schema.sh <project_id>'
  exit 1
fi

mkdir -p tmp
supabase db dump --schema-only --project-id $project_id > tmp/weat_prod_schema_$(date +%Y%m%d_%H%M%S).sql
supabase start

