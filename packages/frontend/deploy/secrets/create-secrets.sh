#!/usr/bin/env bash
if [ -z "${BASH_VERSION:-}" ]; then
  exec bash "$0" "$@"
fi

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../../../.." && pwd)"

usage() {
  cat <<'EOF'
Usage:
  ENV=dev|staging|prod ./deploy/secrets/create-secrets.sh [SECRET_SUFFIX|--all]

With no selector, all frontend secrets are created or updated.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ $# -gt 1 ]]; then
  usage >&2
  exit 1
fi

PROJECT_ID="${PROJECT_ID:-coastal-run-106202}"
ENV="${ENV:-}"
CLOUD_RUN_SERVICE="${ENV}-congress-dashboard-frontend"
SECRET_PREFIX="$CLOUD_RUN_SERVICE"
SECRET_SPEC="${SCRIPT_DIR}/frontend.secrets"
LABELS="env=${ENV},service=congress-dashboard,system=frontend,cloud-run-service=${CLOUD_RUN_SERVICE},resource-type=cloud-run-service,managed-by=deploy-script,data-class=credential"
export PROJECT_ID ENV SECRET_PREFIX SECRET_SPEC LABELS
exec "${ROOT_DIR}/scripts/create-cloud-run-secrets.sh" "${1:---all}"
