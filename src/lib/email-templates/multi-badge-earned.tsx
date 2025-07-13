import React from 'react';

interface MultiBadgeEmailProps {
  userName: string;
  badges: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    type: 'security' | 'scanner' | 'researcher' | 'content' | 'community' | 'streak';
  }>;
  totalBadges: number;
  userRank: number;
  totalPoints: number;
}

export const MultiBadgeEmail: React.FC<MultiBadgeEmailProps> = ({
  userName,
  badges,
  totalBadges,
  userRank,
  totalPoints
}) => {
  const badgeColors = {
    security: '#3b82f6',
    scanner: '#10b981',
    researcher: '#ef4444',
    content: '#8b5cf6',
    community: '#f59e0b',
    streak: '#06b6d4'
  };

  const badgeEmojis = {
    security: '🛡️',
    scanner: '⚡',
    researcher: '🏆',
    content: '📝',
    community: '👥',
    streak: '📅'
  };

  const getBadgeType = (badgeId: string): keyof typeof badgeColors => {
    if (badgeId.includes('security')) return 'security';
    if (badgeId.includes('scanner')) return 'scanner';
    if (badgeId.includes('researcher') || badgeId.includes('hunter')) return 'researcher';
    if (badgeId.includes('content') || badgeId.includes('blogger')) return 'content';
    if (badgeId.includes('community')) return 'community';
    if (badgeId.includes('warrior') || badgeId.includes('champion')) return 'streak';
    return 'security';
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        padding: '30px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
        <h1 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
          Achievement Unlocked!
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
          {badges.length > 1 ? `${badges.length} new badges earned` : 'New badge earned'}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            color: '#1f2937', 
            margin: '0 0 10px 0',
            fontSize: '22px'
          }}>
            Outstanding work, {userName}!
          </h2>
          <p style={{ 
            color: '#6b7280', 
            margin: '0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Your dedication to cybersecurity excellence has earned you {badges.length > 1 ? 'these achievements' : 'this achievement'}
          </p>
        </div>

        {/* Badges Grid */}
        <div style={{ marginBottom: '30px' }}>
          {badges.map((badge) => {
            const badgeType = getBadgeType(badge.id);
            return (
              <div key={badge.id} style={{
                backgroundColor: '#f9fafb',
                border: `2px solid ${badgeColors[badgeType]}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  fontSize: '32px',
                  color: badgeColors[badgeType],
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {badgeEmojis[badgeType]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    color: badgeColors[badgeType],
                    margin: '0 0 5px 0',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {badge.title}
                  </h3>
                  <p style={{ 
                    color: '#4b5563',
                    margin: '0',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Dashboard */}
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <h3 style={{ 
            color: '#1f2937',
            margin: '0 0 20px 0',
            fontSize: '18px',
            textAlign: 'center'
          }}>
            📊 Your Achievement Stats
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#7c3aed',
                marginBottom: '5px'
              }}>
                {totalBadges}
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Total Badges
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: '5px'
              }}>
                #{userRank}
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Leaderboard Rank
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '5px'
              }}>
                {totalPoints.toLocaleString()}
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Total Points
              </div>
            </div>
          </div>
        </div>

        {/* Motivation Section */}
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h4 style={{ 
            color: '#d97706',
            margin: '0 0 10px 0',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🚀 Keep Going!
          </h4>
          <p style={{ 
            color: '#92400e',
            margin: '0',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            You're making excellent progress in your cybersecurity journey. Continue using security tools, completing scans, and contributing to the community to unlock even more achievements!
          </p>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center' }}>
          <a 
            href="https://your-domain.com/portal/profile"
            style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '14px 28px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'inline-block',
              marginBottom: '15px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            🏆 View My Profile
          </a>
          <br />
          <a 
            href="https://your-domain.com/portal/leaderboard"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📈 Check Leaderboard Rankings
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#1f2937',
        color: '#9ca3af',
        padding: '25px 20px',
        textAlign: 'center'
      }}>
        <p style={{ 
          margin: '0 0 15px 0',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          🔐 IECA - International Ethical Cybersecurity Academy
        </p>
        <p style={{ 
          margin: '0 0 15px 0',
          fontSize: '12px',
          lineHeight: '1.5'
        }}>
          Continue your cybersecurity journey with cutting-edge tools, expert guidance, and a supportive community.
        </p>
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <a href="https://your-domain.com" style={{ 
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            🌐 Website
          </a>
          <a href="https://your-domain.com/portal" style={{ 
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            🚪 Portal
          </a>
          <a href="https://your-domain.com/resources" style={{ 
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            📚 Resources
          </a>
        </div>
      </div>
    </div>
  );
};

export default MultiBadgeEmail;
