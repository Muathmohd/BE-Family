class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = null) {
    const item = {
      value: value,
      expiry: ttl ? Date.now() + ttl : null
    };
    this.cache.set(key, item);
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  keys() {
    return Array.from(this.cache.keys());
  }
}

const cacheManager = new CacheManager();

module.exports = cacheManager;
