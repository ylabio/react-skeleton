import {memo, useCallback, useMemo} from "react";
import Select from "@src/ui/elements/select";
import useI18n from "@src/features/i18n/use-i18n.js";
import {TLocale, TLocaleReal} from "@src/features/i18n/types";

function LocaleSelect() {

  const {locale, locales, setLocale, t} = useI18n();

  const options = useMemo(
    () => locales.map(locale => ({value: locale, title: t(`common.locales.${locale}`)})),
    [locale, t]
  );

  const onChange = useCallback((locale: string | number) => {
    setLocale(locale as TLocaleReal);
  }, [setLocale]);

  return (
    <Select onChange={onChange} value={locale as TLocale} options={options}/>
  );
}

export default memo(LocaleSelect);
