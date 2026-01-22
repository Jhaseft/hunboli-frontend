import { Dropdown, DropdownItem, DropdownDivider } from '@/components/common/dropdown';
import { getProfileMenuItems } from './profileMenu.config';

interface ProfileDropdownProps {
  isDashboard: boolean;
  onNavigate: (href: string) => void;
  onLogout: () => void;
  variant?: 'desktop' | 'mobile';
}

export function ProfileDropdown({
  isDashboard,
  onNavigate,
  onLogout,
  variant = 'desktop',
}: ProfileDropdownProps) {
  const menuItems = getProfileMenuItems(isDashboard);

  const handleItemClick = (itemId: string, href?: string) => {
    if (itemId === 'logout') {
      onLogout();
    } else if (href) {
      onNavigate(href);
    }
  };

  // Para mobile, agregar clases adicionales
  const dropdownClassName = variant === 'mobile' ? 'top-12' : '';

  return (
    <Dropdown className={dropdownClassName}>
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        const isLastBeforeDivider =
          index < menuItems.length - 1 && menuItems[index + 1].variant === 'danger';
        const isFirstAfterDivider = index > 0 && menuItems[index - 1].variant !== 'danger';

        return (
          <div key={item.id}>
            {item.variant === 'danger' && isFirstAfterDivider && <DropdownDivider />}

            <DropdownItem
              onClick={() => handleItemClick(item.id, item.href)}
              icon={<IconComponent />}
              variant={item.variant}
            >
              {item.label}
            </DropdownItem>

            {isLastBeforeDivider && <DropdownDivider />}
          </div>
        );
      })}
    </Dropdown>
  );
}
