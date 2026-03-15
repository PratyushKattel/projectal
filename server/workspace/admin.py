from django.contrib import admin
from .models import Workspace, Role, WorkspaceInvite, WsMember, AuthUser

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ['ws_id', 'name', 'owner', 'created_at']
    search_fields = ['name', 'owner__username']
    list_filter = ['created_at']
    readonly_fields = ['ws_id', 'created_at']
    fieldsets = (
        ('Basic Info', {'fields': ('ws_id', 'name', 'owner')}),
        ('Timestamps', {'fields': ('created_at',)}),
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['role_id', 'name', 'ws', 'created_at']
    search_fields = ['name', 'ws__name']
    list_filter = ['name', 'created_at']
    readonly_fields = ['role_id', 'created_at']


@admin.register(WsMember)
class WsMemberAdmin(admin.ModelAdmin):
    list_display = ['member_id', 'user', 'ws', 'role', 'joined_at']
    search_fields = ['user__username', 'ws__name']
    list_filter = ['ws', 'role', 'joined_at']
    readonly_fields = ['member_id', 'joined_at']
    fieldsets = (
        ('Member Info', {'fields': ('member_id', 'user', 'ws', 'role')}),
        ('Timestamps', {'fields': ('joined_at',)}),
    )


@admin.register(WorkspaceInvite)
class WorkspaceInviteAdmin(admin.ModelAdmin):
    list_display = ['invite_id', 'email', 'ws', 'invited_by', 'created_at', 'expires_at']
    search_fields = ['email', 'ws__name']
    list_filter = ['ws', 'created_at', 'expires_at']
    readonly_fields = ['invite_id', 'token', 'created_at']
    fieldsets = (
        ('Invite Info', {'fields': ('invite_id', 'email', 'ws', 'invited_by', 'token')}),
        ('Timestamps', {'fields': ('created_at', 'expires_at')}),
    )
