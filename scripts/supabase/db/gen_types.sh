#!/bin/zsh

# Get project id from environment variable or first arg
project_id=${SUPABASE_PROJECT_ID:-$1}

if [ -z "$project_id" ]; then
  echo 'Supabase project ID is not set. Either set SUPABASE_PROJECT_ID or run ./gen_types.sh <project_id>'
  exit 1
fi

supabase gen types typescript --project-id $project_id --schema public > types/supabase.ts
pnpx prettier --write types/supabase.ts
