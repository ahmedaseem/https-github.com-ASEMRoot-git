// config.js
// Export a named CONFIG object used by app.js.
// You can override values at runtime by defining `window.ASEM_CONFIG`
// before this module is imported (for example, inline in index.html).

// Default values suitable for local development. Change them for production deployment.
const _DEFAULT = {

  api: {
    real: "/api", 
    location: null,
  },

  timeout: 15000,

  mode: "api",

  appName: "ASEM Digital Solutions",
  version: "1.0.0",
  contactEmail: "",

  features: {
    enableDemoBadge: true, 
  },
};

function deepMerge(target, source) {
  if (typeof source !== "object" || source === null) return target;
  const out = Array.isArray(target) ? target.slice() : { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = out[key];
    if (Array.isArray(srcVal)) {
      out[key] = srcVal.slice();
    } else if (typeof srcVal === "object" && srcVal !== null) {
      out[key] = deepMerge(tgtVal && typeof tgtVal === "object" ? tgtVal : {}, srcVal);
    } else {
      out[key] = srcVal;
    }
  }
  return out;
}

const runtimeOverride = typeof window !== "undefined" && window.ASEM_CONFIG ? window.ASEM_CONFIG : null;
export const CONFIG = runtimeOverride ? deepMerge(_DEFAULT, runtimeOverride) : _DEFAULT;

 </script>
