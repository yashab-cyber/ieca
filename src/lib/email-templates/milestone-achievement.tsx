import React from 'react';

interface MilestoneAchievementEmailProps {
  userName: string;
  milestoneType: 'first_badge' | 'badge_collector' | 'achievement_master' | 'leaderboard_top10' | 'points_milestone';
  milestone: {
    title: string;
    description: string;
    value: number;
    icon: string;
  };
  totalBadges: number;
  userRank: number;
  totalPoints: number;
  specialReward?: string;
}

export const MilestoneAchievementEmail: React.FC<MilestoneAchievementEmailProps> = ({
  userName,
  milestoneType,
  milestone,
  totalBadges,
  userRank,
  totalPoints,
  specialReward
}) => {
  const milestoneColors = {
    first_badge: '#10b981',
    badge_collector: '#8b5cf6',
    achievement_master: '#f59e0b',
    leaderboard_top10: '#ef4444',
    points_milestone: '#3b82f6'
  };

  const milestoneBackgrounds = {
    first_badge: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    badge_collector: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    achievement_master: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    leaderboard_top10: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    points_milestone: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
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
        background: milestoneBackgrounds[milestoneType],
        color: '#ffffff',
        padding: '40px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transform: 'rotate(45deg)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          right: '-30px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transform: 'rotate(-45deg)'
        }}></div>
        
        <div style={{ fontSize: '64px', marginBottom: '15px' }}>🎊</div>
        <h1 style={{ 
          margin: '0', 
          fontSize: '32px', 
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          MILESTONE ACHIEVED!
        </h1>
        <p style={{ 
          margin: '15px 0 0 0', 
          fontSize: '18px', 
          opacity: 0.95,
          fontWeight: '500'
        }}>
          {milestone.title}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '40px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 style={{ 
            color: '#1f2937', 
            margin: '0 0 15px 0',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            Incredible Achievement, {userName}!
          </h2>
          <p style={{ 
            color: '#6b7280', 
            margin: '0',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            {milestone.description}
          </p>
        </div>

        {/* Milestone Showcase */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: `3px solid ${milestoneColors[milestoneType]}`,
          borderRadius: '16px',
          padding: '30px',
          textAlign: 'center',
          marginBottom: '35px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: milestoneColors[milestoneType],
            color: '#ffffff',
            padding: '5px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            MILESTONE
          </div>
          
          <div style={{ 
            fontSize: '72px', 
            marginBottom: '20px',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}>
            {milestone.icon}
          </div>
          
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: milestoneColors[milestoneType],
            marginBottom: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {milestone.value.toLocaleString()}
          </div>
          
          <h3 style={{ 
            color: milestoneColors[milestoneType],
            margin: '0',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            {milestone.title}
          </h3>
        </div>

        {/* Special Reward */}
        {specialReward && (
          <div style={{
            backgroundColor: '#fff7ed',
            border: '2px solid #fb923c',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '35px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎁</div>
            <h4 style={{ 
              color: '#ea580c',
              margin: '0 0 10px 0',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Special Reward Unlocked!
            </h4>
            <p style={{ 
              color: '#9a3412',
              margin: '0',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {specialReward}
            </p>
          </div>
        )}

        {/* Achievement Stats */}
        <div style={{
          backgroundColor: '#f1f5f9',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '35px'
        }}>
          <h3 style={{ 
            color: '#1f2937',
            margin: '0 0 25px 0',
            fontSize: '18px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            🏆 Your Achievement Portfolio
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#7c3aed',
                marginBottom: '5px'
              }}>
                {totalBadges}
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                BADGES EARNED
              </div>
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#059669',
                marginBottom: '5px'
              }}>
                #{userRank}
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                GLOBAL RANK
              </div>
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '5px'
              }}>
                {totalPoints.toLocaleString()}
              </div>
              <div style={{ 
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                TOTAL POINTS
              </div>
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '35px',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            color: '#0369a1',
            margin: '0 0 10px 0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            🌟 Share Your Achievement!
          </h4>
          <p style={{ 
            color: '#0c4a6e',
            margin: '0 0 15px 0',
            fontSize: '14px'
          }}>
            Let the cybersecurity community know about your milestone achievement!
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href="#" style={{
              backgroundColor: '#1da1f2',
              color: '#ffffff',
              padding: '8px 16px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Share on Twitter
            </a>
            <a href="#" style={{
              backgroundColor: '#0077b5',
              color: '#ffffff',
              padding: '8px 16px',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Share on LinkedIn
            </a>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center' }}>
          <a 
            href="https://your-domain.com/portal/profile"
            style={{
              background: milestoneBackgrounds[milestoneType],
              color: '#ffffff',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              display: 'inline-block',
              marginBottom: '15px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            🏆 View My Profile
          </a>
          <br />
          <a 
            href="https://your-domain.com/portal/leaderboard"
            style={{
              color: milestoneColors[milestoneType],
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
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
        padding: '30px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '15px' }}>🔐</div>
        <p style={{ 
          margin: '0 0 15px 0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#ffffff'
        }}>
          IECA - International Ethical Cybersecurity Academy
        </p>
        <p style={{ 
          margin: '0 auto 20px auto',
          fontSize: '12px',
          lineHeight: '1.5',
          maxWidth: '400px'
        }}>
          Your journey in cybersecurity excellence continues. Keep pushing boundaries, learning new skills, and contributing to the security community.
        </p>
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: '25px',
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
          <a href="https://your-domain.com/contact" style={{ 
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            📞 Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default MilestoneAchievementEmail;
