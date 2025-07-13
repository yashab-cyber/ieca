import React from 'react';

interface BadgeEarnedEmailProps {
  userName: string;
  badgeTitle: string;
  badgeDescription: string;
  badgeIcon: string;
  badgeType: 'security' | 'scanner' | 'researcher' | 'content' | 'community' | 'streak';
  totalBadges: number;
  nextBadgeHint?: string;
}

export const BadgeEarnedEmail: React.FC<BadgeEarnedEmailProps> = ({
  userName,
  badgeTitle,
  badgeDescription,
  badgeIcon,
  badgeType,
  totalBadges,
  nextBadgeHint
}) => {
  const badgeColors = {
    security: '#3b82f6', // blue
    scanner: '#10b981', // green
    researcher: '#ef4444', // red
    content: '#8b5cf6', // purple
    community: '#f59e0b', // amber
    streak: '#06b6d4' // cyan
  };

  const badgeEmojis = {
    security: '🛡️',
    scanner: '⚡',
    researcher: '🏆',
    content: '📝',
    community: '👥',
    streak: '📅'
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: '20px',
        textAlign: 'center'
      }}>
        <img 
          src="https://your-domain.com/email/ieca-logo.jpg" 
          alt="IECA Logo" 
          style={{ height: '40px', marginBottom: '10px' }}
        />
        <h1 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
          🎉 Badge Earned!
        </h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#1f2937', 
            margin: '0 0 10px 0',
            fontSize: '20px'
          }}>
            Congratulations, {userName}!
          </h2>
          <p style={{ 
            color: '#6b7280', 
            margin: '0',
            fontSize: '16px'
          }}>
            You've earned a new achievement badge
          </p>
        </div>

        {/* Badge Display */}
        <div style={{
          backgroundColor: '#f9fafb',
          border: `3px solid ${badgeColors[badgeType]}`,
          borderRadius: '12px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '15px',
            color: badgeColors[badgeType]
          }}>
            {badgeEmojis[badgeType]}
          </div>
          <h3 style={{ 
            color: badgeColors[badgeType],
            margin: '0 0 10px 0',
            fontSize: '22px',
            fontWeight: 'bold'
          }}>
            {badgeTitle}
          </h3>
          <p style={{ 
            color: '#4b5563',
            margin: '0',
            fontSize: '16px'
          }}>
            {badgeDescription}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center', flex: '1' }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#1f2937'
              }}>
                {totalBadges}
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '14px'
              }}>
                Total Badges
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: '1' }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: badgeColors[badgeType]
              }}>
                🎯
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '14px'
              }}>
                Achievement
              </div>
            </div>
          </div>
        </div>

        {/* Next Badge Hint */}
        {nextBadgeHint && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '30px'
          }}>
            <h4 style={{ 
              color: '#d97706',
              margin: '0 0 8px 0',
              fontSize: '16px'
            }}>
              💡 Next Challenge
            </h4>
            <p style={{ 
              color: '#92400e',
              margin: '0',
              fontSize: '14px'
            }}>
              {nextBadgeHint}
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div style={{ textAlign: 'center' }}>
          <a 
            href="https://your-domain.com/portal/profile"
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'inline-block',
              marginBottom: '15px'
            }}
          >
            View My Profile
          </a>
          <br />
          <a 
            href="https://your-domain.com/portal/leaderboard"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Check Leaderboard Rankings
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb'
      }}>
        <p style={{ 
          color: '#6b7280',
          margin: '0',
          fontSize: '14px'
        }}>
          Keep up the great work! Continue your cybersecurity journey with IECA.
        </p>
        <div style={{ marginTop: '15px' }}>
          <a href="https://your-domain.com" style={{ 
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '12px',
            marginRight: '15px'
          }}>
            Visit Website
          </a>
          <a href="https://your-domain.com/portal" style={{ 
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '12px',
            marginRight: '15px'
          }}>
            Member Portal
          </a>
          <a href="https://your-domain.com/contact" style={{ 
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '12px'
          }}>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default BadgeEarnedEmail;
