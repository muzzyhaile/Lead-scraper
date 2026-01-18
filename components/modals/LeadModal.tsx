/**
 * LeadModal Component
 * Unified modal for viewing and editing lead details
 */

import React, { useState } from 'react';
import { Lead, PipelineStage, Comment } from '../../types/domain/lead';
import { Button } from '../shared/Button';
import { Input, TextArea } from '../shared/Input';
import { StageBadge, QualityBadge } from '../shared/Badge';
import { Card, CardSection } from '../shared/Card';
import { formatDate } from '../../utils/format';

export interface LeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  onDelete?: (leadId: string) => void;
}

export function LeadModal({ lead, isOpen, onClose, onSave, onDelete }: LeadModalProps) {
  const [editedLead, setEditedLead] = useState<Lead | null>(lead);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');

  React.useEffect(() => {
    setEditedLead(lead);
    setIsEditing(false);
    setNewComment('');
  }, [lead]);

  if (!isOpen || !editedLead) return null;

  const handleSave = () => {
    if (editedLead) {
      onSave(editedLead);
      setIsEditing(false);
      onClose();
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && editedLead) {
      const comment: Comment = {
        id: crypto.randomUUID(),
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
        author: 'Current User',
      };
      setEditedLead({
        ...editedLead,
        comments: [...(editedLead.comments || []), comment],
      });
      setNewComment('');
    }
  };

  const handleStageChange = (stage: PipelineStage) => {
    if (editedLead) {
      setEditedLead({ ...editedLead, stage });
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedLead.companyName}
                  onChange={(e) =>
                    setEditedLead({ ...editedLead, companyName: e.target.value })
                  }
                  className="text-xl font-bold"
                  fullWidth
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">
                  {editedLead.companyName}
                </h2>
              )}
              <div className="flex items-center gap-3 mt-2">
                <StageBadge stage={editedLead.stage} />
                {editedLead.qualityScore && (
                  <QualityBadge score={editedLead.qualityScore} />
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <Card>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedLead.contactName || ''}
                      onChange={(e) =>
                        setEditedLead({ ...editedLead, contactName: e.target.value })
                      }
                      fullWidth
                    />
                  ) : (
                    <p className="text-gray-900">{editedLead.contactName || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedLead.email || ''}
                      onChange={(e) =>
                        setEditedLead({ ...editedLead, email: e.target.value })
                      }
                      fullWidth
                    />
                  ) : (
                    <p className="text-gray-900">{editedLead.email || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedLead.phone || ''}
                      onChange={(e) =>
                        setEditedLead({ ...editedLead, phone: e.target.value })
                      }
                      fullWidth
                    />
                  ) : (
                    <p className="text-gray-900">{editedLead.phone || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedLead.website || ''}
                      onChange={(e) =>
                        setEditedLead({ ...editedLead, website: e.target.value })
                      }
                      fullWidth
                    />
                  ) : (
                    <a
                      href={editedLead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline"
                    >
                      {editedLead.website || 'N/A'}
                    </a>
                  )}
                </div>
              </div>

              {editedLead.address && (
                <CardSection>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <p className="text-gray-900">{editedLead.address}</p>
                </CardSection>
              )}
            </Card>

            {/* Deal Info */}
            {editedLead.dealValue !== undefined && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deal Value
                    </label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedLead.dealValue}
                        onChange={(e) =>
                          setEditedLead({
                            ...editedLead,
                            dealValue: parseFloat(e.target.value),
                          })
                        }
                        fullWidth
                      />
                    ) : (
                      <p className="text-xl font-bold text-gray-900">
                        ${editedLead.dealValue.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pipeline Stage
                    </label>
                    {isEditing ? (
                      <select
                        value={editedLead.stage}
                        onChange={(e) =>
                          handleStageChange(e.target.value as PipelineStage)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="New">New</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    ) : (
                      <StageBadge stage={editedLead.stage} />
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Enriched Data */}
            {editedLead.enrichedData && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enriched Information
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  {editedLead.enrichedData.summary && (
                    <p>{editedLead.enrichedData.summary}</p>
                  )}
                  {editedLead.enrichedData.services && (
                    <div>
                      <span className="font-medium">Services: </span>
                      {editedLead.enrichedData.services.join(', ')}
                    </div>
                  )}
                  {editedLead.enrichedData.recentNews && (
                    <div>
                      <span className="font-medium">Recent News: </span>
                      {editedLead.enrichedData.recentNews}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
              <div className="space-y-3 mb-4">
                {editedLead.comments?.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                ))}
                {(!editedLead.comments || editedLead.comments.length === 0) && (
                  <p className="text-sm text-gray-500">No comments yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <TextArea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  fullWidth
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Add
                </Button>
              </div>
            </Card>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this lead?')) {
                      onDelete(editedLead.id);
                      onClose();
                    }
                  }}
                >
                  Delete Lead
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              {isEditing ? (
                <Button onClick={handleSave}>Save Changes</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
