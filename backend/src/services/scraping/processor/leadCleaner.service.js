const REGEX = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  phone: /\+?[1-9]\d{7,15}/g
};

class LeadCleaner {
  process(leads) {
    const cleaned = [];
    for (const lead of leads) {
      const cleanLead = this._cleanSingle(lead);
      if (this._isValidLead(cleanLead)) {
        cleaned.push(cleanLead);
      }
    }
    return cleaned;
  }

  _cleanSingle(lead) {
    const clean = { ...lead };
    clean.name = this._cleanName(clean.name || '');
    clean.emails = Array.from((clean.linkedin_url + (clean.bio || '')).matchAll(REGEX.email)).map(m => m[0]);
    clean.phones = this._extractPhones(clean);
    clean.company = this._extractCompany(clean.linkedin_url || '');
    return clean;
  }

  _cleanName(name) {
    return name.toString().trim().replace(/\s+/g, ' ').slice(0, 100);
  }

  _extractPhones(lead) {
    const text = (lead.bio || '') + (lead.description || '');
    return Array.from(text.matchAll(REGEX.phone)).map(m => m[0]);
  }

  _extractCompany(url) {
    if (!url) return '';
    const match = url.match(/\/company\/([^\/?]+)/);
    return match ? match[1] : '';
  }

  _isValidLead(lead) {
    return !!lead.name;
  }
}

module.exports = LeadCleaner;

