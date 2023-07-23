import {memo} from "react";
import {cn as bem} from '@bem-react/classname';
import {TTranslateFn} from "@src/services/i18n/types";
import './style.less';

interface Props {
  data: {
    email?: string,
    profile?: {
      name?: string,
      phone?: string
    }
  },
  t: TTranslateFn
}

function ProfileCard({data, t}: Props) {
  const cn = bem('ProfileCard');
  return (
    <div className={cn()}>
      <h2>{t('auth.profile.title')}</h2>
      <div className={cn('prop')}>
        <div className={cn('label')}>{t('auth.profile.name')}:</div>
        <div className={cn('value')}>{data.profile?.name}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{t('auth.profile.phone')}:</div>
        <div className={cn('value')}>{data.profile?.phone}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{t('auth.profile.email')}:</div>
        <div className={cn('value')}>{data.email}</div>
      </div>
    </div>
  );
}

export default memo(ProfileCard);
