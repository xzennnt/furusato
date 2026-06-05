import { useEffect, useMemo, useState } from 'react';
import { translateTexts } from '../lib/api';

function collectEntries(items, fields) {
  const entries = [];

  items.forEach((item, index) => {
    fields.forEach((field) => {
      const value = item?.[field];

      if (typeof value === 'string' && value.trim()) {
        entries.push({ index, field, value });
      }
    });
  });

  return entries;
}

function buildSignature(items, fields) {
  return JSON.stringify({
    items,
    fields,
  });
}

export function useTranslatedItems(items = [], fields = [], language = 'id') {
  const [translatedItems, setTranslatedItems] = useState(items);
  const signature = buildSignature(items, fields);
  const fieldsSignature = fields.join('|');
  // The serialized signatures already capture the relevant source data.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const normalizedItems = useMemo(() => items, [signature]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const normalizedFields = useMemo(() => fields, [fieldsSignature]);

  useEffect(() => {
    let active = true;

    async function run() {
      if (language !== 'ja') {
        setTranslatedItems(normalizedItems);
        return;
      }

      const entries = collectEntries(normalizedItems, normalizedFields);

      if (!entries.length) {
        setTranslatedItems(normalizedItems);
        return;
      }

      try {
        const translatedValues = await translateTexts(entries.map((entry) => entry.value), {
          source: 'id',
          target: 'ja',
        });

        if (!active) {
          return;
        }

        const nextItems = normalizedItems.map((item) => ({ ...item }));
        entries.forEach((entry, index) => {
          nextItems[entry.index][entry.field] = translatedValues[index] || entry.value;
        });
        setTranslatedItems(nextItems);
      } catch (_error) {
        if (active) {
          setTranslatedItems(normalizedItems);
        }
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [language, normalizedFields, normalizedItems]);

  return translatedItems;
}

export function useTranslatedObject(object = null, fields = [], language = 'id') {
  const items = useMemo(() => (object ? [object] : []), [object]);
  const translatedItems = useTranslatedItems(items, fields, language);
  return translatedItems[0] || object;
}
